import React from 'react';

interface State {
  hasError: boolean;
  error: Error | null;
  info: string | null;
}

export class ErrorBoundary extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error, info: null };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to console and keep stack for display
    console.error('ErrorBoundary caught an error:', error, info);
    this.setState({ error, info: info.componentStack });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, fontFamily: 'system-ui, sans-serif' }}>
          <h2 style={{ color: '#b91c1c' }}>Application error detected</h2>
          <p>We caught an exception while rendering the app. This helps debugging.</p>
          <div style={{ whiteSpace: 'pre-wrap', background: '#111827', color: '#f9fafb', padding: 12, borderRadius: 6, marginTop: 12 }}>
            <strong>Error:</strong>
            <div>{String(this.state.error)}</div>
            <strong style={{ marginTop: 8 }}>Component stack:</strong>
            <div>{this.state.info}</div>
          </div>
          <div style={{ marginTop: 12 }}>
            <button onClick={() => window.location.reload()} style={{ padding: '8px 12px', background: '#2563eb', color: 'white', borderRadius: 6 }}>Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
