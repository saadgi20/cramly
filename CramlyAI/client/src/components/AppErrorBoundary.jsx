import React from 'react'

class AppErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { error: null }
    }

    static getDerivedStateFromError(error) {
        return { error }
    }

    componentDidCatch(error, info) {
        console.error('App render failed:', error, info)
    }

    render() {
        if (this.state.error) {
            return (
                <div className='theme-page px-6 py-10'>
                    <div className='theme-panel mx-auto max-w-2xl border-red-200 bg-red-50/70 p-6'>
                        <h1 className='theme-title text-xl font-semibold'>
                            Something went wrong while loading the app.
                        </h1>
                        <p className='mt-3 text-sm text-red-600'>
                            {this.state.error.message}
                        </p>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default AppErrorBoundary
