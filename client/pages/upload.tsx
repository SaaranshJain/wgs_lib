import { Box, Button, TextField } from '@mui/material';
import type { NextPage } from 'next';
import { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import { FormEvent } from 'react-transition-group/node_modules/@types/react';
import { useRouter } from 'next/dist/client/router';

interface Doc {
    title: string;
    cover_edition_key: string;
}

const UploadPage: NextPage = () => {
    const [title, setTitle] = useState('');
    const [chosenFileName, setChosenFileName] = useState('No file chosen');
    const [file, setFile] = useState<File | null>(null);
    const [cover, setCover] = useState('kek');
    const [choices, setChoices] = useState<Doc[]>([]);

    useEffect(() => {
        if (!file || cover === 'kek') {
            return;
        }

        const body = new FormData();
        body.append('file', file);
        body.append('title', title);
        body.append('cover', cover);
        
        axios.post('http://localhost:8000/file', body).then(() => router.push('/'));
    }, [cover]);

    const router = useRouter();

    const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setChosenFileName(ev.target.value.split(/fakepath(\/|\\)/gi)[2] ?? 'No file chosen');

        if (ev.target.files?.[0]) {
            setFile(ev.target.files[0]);
        }
    };

    const handleSetChoices = (ev: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setTitle(ev.target.value);

        axios
            .get<{ docs: Doc[] }>(
                `https://openlibrary.org/search.json?q=${encodeURIComponent(
                    title
                )}&_facet=false&_spellcheck_count=0&limit=10&fields=title,cover_edition_key&mode=everything`
            )
            .then(res => {
                setChoices(Array.from(new Set(res.data.docs)));
            });
    };

    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
            style={{ marginTop: '6rem', marginLeft: '2rem' }}
            onSubmit={async (ev: FormEvent) => {
                ev.preventDefault();

                const res = await axios.get<{ docs: Doc[] }>(
                    `https://openlibrary.org/search.json?q=${encodeURIComponent(
                        title
                    )}&_facet=false&_spellcheck_count=0&limit=10&fields=title,cover_edition_key&mode=everything`
                );

                setChoices(Array.from(new Set(res.data.docs)));
                
                setCover(choices.find(v => v.title === title)?.cover_edition_key || 'kek');
            }}
        >
            <TextField
                required
                onChange={handleSetChoices}
                label="Book Title"
                variant="filled"
                style={{ width: '30vw' }}
                inputProps={{ list: 'choices' }}
            />
            <datalist id="choices">
                {choices.map((choice, i) => (
                    <option key={i} value={choice.title} />
                ))}
            </datalist>
            <br />
            <Button variant="contained" component="label">
                Choose File
                <input type="file" hidden onChange={handleChange} />
            </Button>
            <label>{chosenFileName}</label>
            <br />
            <Button variant="contained" type="submit">
                Upload
            </Button>
        </Box>
    );
};

export default UploadPage;
