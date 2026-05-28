'use client';

import React from 'react';

export class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-white bg-red-900 h-full flex flex-col gap-4">
          <h1 className="text-2xl font-bold">ERROR FATAL ATrapado</h1>
          <p className="font-mono text-xs">{this.state.error?.message || 'Error desconocido'}</p>
          <pre className="font-mono text-[10px] bg-black p-2 rounded overflow-auto">
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
