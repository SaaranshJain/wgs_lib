import { Box, Button, TextField } from '@mui/material';
import type { NextPage } from 'next';
import { useState } from 'react';
import axios from 'axios';
import { FormEvent } from 'react-transition-group/node_modules/@types/react';

const UploadPage: NextPage = () => {
    const [title, setTitle] = useState('');
    const [chosenFile, setChosenFile] = useState('No file chosen');
    const [choices, setChoices] = useState<string[]>([]);

    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
            style={{ marginTop: '6rem', marginLeft: '2rem' }}
            onSubmit={(ev: FormEvent) => {
                ev.preventDefault();
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
                <input
                    type="file"
                    hidden
                    onChange={ev => setChosenFile(ev.target.value.split(/fakepath(\/|\\)/gi)[2] ?? 'No file chosen')}
                />
            </Button>
            <label>{chosenFile}</label>
            <br />
            <Button variant="contained" type="submit">
                Upload
            </Button>
        </Box>
    );
};

export default UploadPage;
