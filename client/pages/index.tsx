import { Add } from '@mui/icons-material';
import { Fab } from '@mui/material';
import axios from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Home: NextPage = () => {
    const [data, setData] = useState<{ [key: string]: { cover: string; loc: string } }>({});
    const router = useRouter();

    useEffect(() => {
        axios.get('http://localhost:8000/').then(res => setData(res.data));
    }, []);

    return (
        <>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr',
                    rowGap: '1rem',
                    placeItems: 'center',
                    marginTop: '5rem',
                    paddingBottom: '5rem',
                }}
            >
                {Object.entries(data).map((v, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img
                            style={{ cursor: 'pointer' }}
                            src={`https://covers.openlibrary.org/b/olid/${v[1].cover}-L.jpg`}
                            alt=""
                            onClick={ev => window.open(v[1].loc, '_blank')}
                        ></img>
                        <p style={{ fontSize: 'large' }}>{v[0]}</p>
                    </div>
                ))}
            </div>
            <Link href="/upload">
                <Fab style={{ position: 'fixed', bottom: '2rem', right: '2rem' }} color="primary">
                    <Add />
                </Fab>
            </Link>
        </>
    );
};

export default Home;
