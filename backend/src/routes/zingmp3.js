import express from 'express';
import pkg from 'zingmp3-api-full-v3';
const { ZingMp3 } = pkg;

// Patch: Override getCookie to use environment variable if present
// This helps bypass ZingMP3's blocks on Vercel by using a real user cookie
if (process.env.ZING_MP3_COOKIE) {
    let cookie = process.env.ZING_MP3_COOKIE;
    // Auto-fix if user pasted "Cookie: " prefix
    if (cookie.startsWith('Cookie:')) {
        cookie = cookie.substring(7).trim();
    }

    console.log('🍪 Using custom ZingMP3 cookie from environment (Length:', cookie.length, ')');

    ZingMp3.getCookie = function () {
        return Promise.resolve(cookie);
    };
}

const router = express.Router();

// Helper function để xử lý errors
const handleError = (res, error, message = 'API Error') => {
    console.error(`${message}:`, error);
    res.status(500).json({
        error: message,
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
};

/**
 * GET /api/trending
 * Lấy bài hát trending
 */
router.get('/trending', async (req, res) => {
    try {
        console.log('[Trending] Fetching trending songs...');
        const response = await ZingMp3.getChartHome();

        if (!response?.data?.RTChart?.items) {
            console.warn('[Trending] Missing items in response:', response ? 'Response OK' : 'Response NULL');
        }

        const items = response?.data?.RTChart?.items || [];
        console.log(`[Trending] Found ${items.length} items`);
        res.json(items);
    } catch (error) {
        handleError(res, error, 'Error getting trending songs');
    }
});

/**
 * GET /api/recommendations
 * Lấy đề xuất bài hát
 */
router.get('/recommendations', async (req, res) => {
    try {
        const response = await ZingMp3.getChartHome();
        const items = response?.data?.RTChart?.items || [];
        res.json(items);
    } catch (error) {
        handleError(res, error, 'Error getting recommendations');
    }
});

/**
 * GET /api/new-releases
 * Lấy bài hát mới phát hành
 */
router.get('/new-releases', async (req, res) => {
    try {
        console.log('[NewReleases] Fetching new releases...');
        const response = await ZingMp3.getNewReleaseChart();

        // Response format: {err, msg, data: {items: {all: [...], vPop: [...], others: [...]}}}
        let items = [];
        if (response?.data?.items) {
            items = response.data.items.all || response.data.items.vPop || response.data.items.others || [];
        } else if (Array.isArray(response?.data)) {
            items = response.data;
        }

        if (items.length === 0) {
            console.warn('[NewReleases] No items found in response');
        } else {
            console.log(`[NewReleases] Found ${items.length} items`);
        }

        res.json(items);
    } catch (error) {
        handleError(res, error, 'Error getting new releases');
    }
});

/**
 * GET /api/chart
 * Lấy chart home
 */
router.get('/chart', async (req, res) => {
    try {
        const response = await ZingMp3.getChartHome();
        res.json(response?.data || {});
    } catch (error) {
        handleError(res, error, 'Error getting chart');
    }
});

/**
 * GET /api/top100
 * Lấy top 100
 */
router.get('/top100', async (req, res) => {
    try {
        const response = await ZingMp3.getTop100();

        // Flatten sections into single array of playlists
        let playlists = [];
        if (Array.isArray(response?.data)) {
            playlists = response.data.flatMap(section =>
                Array.isArray(section.items) ? section.items : []
            );
        }

        res.json(playlists);
    } catch (error) {
        handleError(res, error, 'Error getting top 100');
    }
});

/**
 * GET /api/song/:id
 * Lấy thông tin bài hát (bao gồm streaming URL)
 */
router.get('/song/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // getSong trả về streaming info, getInfoSong trả về song metadata
        const [streamingResult, infoResult] = await Promise.allSettled([
            ZingMp3.getSong(id),
            ZingMp3.getInfoSong(id)
        ]);

        const streamingRes = streamingResult.status === 'fulfilled' ? streamingResult.value : null;
        const infoRes = infoResult.status === 'fulfilled' ? infoResult.value : null;

        if (!infoRes && !streamingRes) {
            return res.status(404).json({ error: 'Song not found' });
        }

        // Merge data, ưu tiên infoRes cho metadata
        const data = {
            ...(infoRes?.data || {}),
            streaming: streamingRes?.data || null
        };

        // Log warnings if partial failure
        if (streamingResult.status === 'rejected') {
            console.warn(`Failed to fetch streaming for ${id}:`, streamingResult.reason);
        }
        if (infoResult.status === 'rejected') {
            console.warn(`Failed to fetch info for ${id}:`, infoResult.reason);
        }

        res.json(data);
    } catch (error) {
        handleError(res, error, 'Error getting song info');
    }
});

/**
 * GET /api/playlist/:id
 * Lấy thông tin playlist/album
 */
router.get('/playlist/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await ZingMp3.getDetailPlaylist(id);
        res.json(response?.data || {});
    } catch (error) {
        handleError(res, error, 'Error getting playlist');
    }
});

/**
 * GET /api/artist/:id
 * Lấy thông tin ca sĩ
 */
router.get('/artist/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await ZingMp3.getArtist(id);
        res.json(response?.data || {});
    } catch (error) {
        handleError(res, error, 'Error getting artist');
    }
});

/**
 * GET /api/search?q=keyword
 * Tìm kiếm
 */
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Query parameter "q" is required' });
        }

        const response = await ZingMp3.search(q);
        res.json(response?.data || {});
    } catch (error) {
        handleError(res, error, 'Error searching');
    }
});

/**
 * GET /api/home
 * Lấy trang chủ
 */
router.get('/home', async (req, res) => {
    try {
        const cookie = process.env.ZING_MP3_COOKIE;
        console.log(`[Home] Request received. Cookie present: ${!!cookie}, length: ${cookie?.length}`);

        const response = await ZingMp3.getHome();

        if (!response) {
            console.warn('[Home] Response is null/undefined');
        } else if (!response.data) {
            console.warn('[Home] Response.data is missing:', JSON.stringify(response));
        } else {
            console.log('[Home] Success. Data keys:', Object.keys(response.data));
        }

        res.json(response?.data || {});
    } catch (error) {
        handleError(res, error, 'Error getting home');
    }
});

/**
 * GET /api/lyric?id=songId
 * Lấy lời bài hát
 */
router.get('/lyric', async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ error: 'Query parameter "id" is required' });
        }

        const response = await ZingMp3.getLyric(id);
        res.json(response || {});
    } catch (error) {
        handleError(res, error, 'Error getting lyric');
    }
});

/**
 * GET /api/debug/song/:id
 * Debug endpoint - test song fetch without caching
 */
/**
 * GET /api/debug/env
 * Check environment configuration
 */
router.get('/debug/env', (req, res) => {
    const cookie = process.env.ZING_MP3_COOKIE;
    res.json({
        hasCookie: !!cookie,
        cookieLength: cookie ? cookie.length : 0,
        cookiePreview: cookie ? cookie.substring(0, 15) + '...' : null,
        timestamp: Date.now(),
        nodeEnv: process.env.NODE_ENV
    });
});

/**
 * GET /api/debug/song/:id
 * Debug endpoint - test song fetch without caching
 */
router.get('/debug/song/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cookie = process.env.ZING_MP3_COOKIE;

        console.log(`\n🔍 Debug: Fetching song ${id}...`);

        // Try both methods and capture errors
        let infoData = null;
        let infoError = null;
        try {
            const result = await ZingMp3.getInfoSong(id);
            infoData = result.data;
        } catch (e) {
            infoError = e.message;
        }

        let songData = null;
        let songError = null;
        try {
            const result = await ZingMp3.getSong(id);
            songData = result.data;
        } catch (e) {
            songError = e.message;
        }

        const response = {
            sysInfo: {
                hasCookie: !!cookie,
                cookieLength: cookie ? cookie.length : 0,
            },
            request: { songId: id },
            results: {
                info: {
                    success: !!infoData,
                    data: infoData,
                    error: infoError
                },
                streaming: { // This calls getSong
                    success: !!songData,
                    data: songData,
                    error: songError
                }
            }
        };

        res.json(response);
    } catch (error) {
        console.error(`❌ Debug error for ${req.params.id}:`, error);
        handleError(res, error, 'Error debugging song');
    }
});

export default router;
