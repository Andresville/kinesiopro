import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Error no controlado en la UI:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-shell error-boundary">
          <div className="error-boundary-content">
            <div className="section-title modal-title">
              Ocurrió un error inesperado
            </div>
            <p className="loading-text">Recargá la página para continuar.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
