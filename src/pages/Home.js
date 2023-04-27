import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Container } from '@mui/material'
import file from "./Page.md"

export default function Home() {

    const [content, setContent] = useState("");

    useEffect(() => {
        fetch(file)
            .then((res) => res.text())
            .then((text => setContent(text)));
    }, []);

    return (

        <Container>
        {
            content &&
            <ReactMarkdown children={content} />     
        }
        </Container>
        
    )
}
 

