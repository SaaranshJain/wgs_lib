import { Box, Button, TextField } from '@mui/material';
import type { NextPage } from 'next';
import { useState } from 'react';
import axios from 'axios';

const UploadPage: NextPage = () => {
    const [title, setTitle] = useState('');
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
        >
            <TextField
                onChange={ev => {
                    setTitle(ev.target.value);

                    axios
                        .get(
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
        </Box>
    );
};

export default UploadPage;
