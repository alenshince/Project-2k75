import React, { Component, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Project 2K75 System Failure caught by ErrorBoundary:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#020617',
            color: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Courier New', Courier, monospace",
            padding: '24px',
            boxSizing: 'border-box',
            zIndex: 9999999,
          }}
        >
          <div
            style={{
              maxWidth: '680px',
              width: '100%',
              border: '1px solid rgba(239, 68, 68, 0.6)',
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              padding: '32px',
              borderRadius: '4px',
              boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)',
            }}
          >
            <div
              style={{
                color: '#ef4444',
                fontSize: '13px',
                letterSpacing: '3px',
                fontWeight: 'bold',
                marginBottom: '12px',
              }}
            >
              CRITICAL HARDWARE FAULT // SYSTEM DESYNC
            </div>
            <div style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px' }}>
              The optical survey terminal encountered an unrecoverable execution fault during graphic or telemetry rendering.
            </div>

            {this.state.error && (
              <div
                style={{
                  backgroundColor: 'rgba(2, 6, 23, 0.9)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '14px',
                  borderRadius: '3px',
                  color: '#fca5a5',
                  fontSize: '12px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  marginBottom: '24px',
                  maxHeight: '160px',
                  overflowY: 'auto',
                }}
              >
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid #ef4444',
                  color: '#fecaca',
                  padding: '10px 20px',
                  fontSize: '12px',
                  letterSpacing: '2px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  borderRadius: '2px',
                }}
              >
                REBOOT TERMINAL
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)

