import '../styles/globals.css';
import Surface from '../components/Surface';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Surface>
            <Component {...pageProps} />
        </Surface>
    );
}
export default MyApp;
