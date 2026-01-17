import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console in development
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        this.setState({
            error,
            errorInfo,
        });

        // TODO: Log to error monitoring service (Sentry, etc.)
        // logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-dark-950 px-4">
                    <div className="max-w-md w-full text-center">
                        <div className="mb-6">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                                <AlertTriangle className="w-10 h-10 text-red-400" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-100 mb-2">
                                Oops! Có lỗi xảy ra
                            </h1>
                            <p className="text-gray-400 mb-6">
                                Đã xảy ra lỗi không mong muốn. Vui lòng thử lại hoặc quay về trang chủ.
                            </p>
                        </div>

                        {/* Error details (only in development) */}
                        {import.meta.env.DEV && this.state.error && (
                            <div className="mb-6 p-4 bg-dark-800 rounded-xl text-left">
                                <p className="text-sm font-mono text-red-400 mb-2">
                                    {this.state.error.toString()}
                                </p>
                                {this.state.errorInfo && (
                                    <details className="text-xs text-gray-500">
                                        <summary className="cursor-pointer hover:text-gray-400">
                                            Stack trace
                                        </summary>
                                        <pre className="mt-2 overflow-auto">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        )}

                        <div className="flex gap-3 justify-center">
                            <Button
                                onClick={this.handleReset}
                                variant="outline"
                                leftIcon={<RefreshCw className="w-5 h-5" />}
                            >
                                Thử lại
                            </Button>
                            <Button
                                onClick={this.handleGoHome}
                                variant="primary"
                                leftIcon={<Home className="w-5 h-5" />}
                            >
                                Về trang chủ
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
