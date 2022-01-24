import { Box, Button, Snackbar, TextField } from '@mui/material';
import type { NextPage } from 'next';
import { useState, ChangeEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/dist/client/router';

interface Doc {
    title: string;
    cover_edition_key: string;
}

const UploadPage: NextPage = () => {
    const [title, setTitle] = useState('');
    const [chosenFileName, setChosenFileName] = useState('No file chosen');
    const [file, setFile] = useState<File | null>(null);
    const [choices, setChoices] = useState<Doc[]>([]);
    const [snackbarMsg, setSnackbarMsg] = useState<string | null>(null);

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
        >
            {snackbarMsg && <Snackbar message={snackbarMsg} />}
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
            <Button
                variant="contained"
                onClick={async () => {
                    const res = await axios.get<{ docs: Doc[] }>(
                        `https://openlibrary.org/search.json?q=${encodeURIComponent(
                            title
                        )}&_facet=false&_spellcheck_count=0&limit=10&fields=title,cover_edition_key&mode=everything`
                    );

                    const newCover = Array.from(new Set(res.data.docs)).find(v => v.title === title)?.cover_edition_key;

                    console.log(file, newCover);

                    if (!file || !newCover) {
                        return;
                    }

                    const body = new FormData();
                    body.append('file', file);
                    body.append('title', title);
                    body.append('cover', newCover);

                    axios
                        .post('https://lookatthose.rocks/wgs_lib/backend/file/', body)
                        .then(() => router.push('/'))
                        .catch(() => setSnackbarMsg('Failed to upload file, try a smaller file'));
                }}
            >
                Upload
            </Button>
        </Box>
    );
};

export default UploadPage;
