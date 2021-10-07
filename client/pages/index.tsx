import { Add } from '@mui/icons-material';
import { Fab } from '@mui/material';
import type { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
    return (
        <Link href="/upload">
            <Fab style={{ position: 'absolute', bottom: '2rem', right: '2rem' }} color="primary">
                <Add />
            </Fab>
        </Link>
    );
};

export default Home;
