import { Box, Button, TextField } from '@mui/material';
import type { NextPage } from 'next';
import { useState, ChangeEvent } from 'react';
import axios from 'axios';
import { FormEvent } from 'react-transition-group/node_modules/@types/react';

const UploadPage: NextPage = () => {
    const [title, setTitle] = useState('');
    const [chosenFileName, setChosenFileName] = useState('No file chosen');
    const [file, setFile] = useState<File | null>(null);
    const [choices, setChoices] = useState<string[]>([]);

    const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setChosenFileName(ev.target.value.split(/fakepath(\/|\\)/gi)[2] ?? 'No file chosen');

        if (ev.target.files?.[0]) {
            setFile(ev.target.files[0]);
        }
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

                if (!file) {
                    return;
                }

                const body = new FormData();
                body.append('file', file);
                await axios.post('http://localhost:8000/file', body);
            }}
        >
            <TextField
                required
                onChange={ev => {
                    setTitle(ev.target.value);

                    axios
                        .get<{ docs: { title: string }[] }>(
                            `https://openlibrary.org/search.json?q=${encodeURIComponent(
                                title
                            )}&_facet=false&_spellcheck_count=0&limit=10&fields=key,cover_i,title,author_name,name&mode=everything`
                        )
                        .then(res => {
                            setChoices(Array.from(new Set(res.data.docs.map(doc => doc.title))));
                        });

                    console.log(choices);
                }}
                label="Book Title"
                variant="filled"
                style={{ width: '30vw' }}
                inputProps={{ list: 'choices' }}
            />
            <datalist id="choices">
                {choices.map(choice => (
                    <option key={choice} value={choice} />
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
