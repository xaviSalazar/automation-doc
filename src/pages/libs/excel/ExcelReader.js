import React, { useState, useEffect } from 'react';
import {
    IconButton
} from '@mui/material';
// excel data types
import { SheetJSFT } from './types';
// xlsx
import { read, utils } from 'xlsx';
import { make_cols } from './MakeColumns';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { styled } from '@mui/material/styles';


export default function ExcelReader({setRows}) {

    const [file, SetFile] = useState(null)
    //const [data, SetData] = useState([])
    const [cols, SetCols] = useState([])

    // upload file button handle
    const handleChange = (e) => {
        const files = e.target.files;
        if (files && files[0]) SetFile(files[0]);
    };

    const handleFile = () => {
        /* Boilerplate to set up FileReader */
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;

        reader.onload = (e) => {
            /* Parse data */
            const bstr = e.target.result;
            const wb = read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = utils.sheet_to_json(ws);
            /* Update state */
            setRows(data)
            SetCols(make_cols(ws['!ref']))
            console.log(data)
            // this.setState({ data: data, cols: make_cols(ws['!ref']) }, () => {
            // console.log(JSON.stringify(this.state.data, null, 2));
            // });
        };

        if (rABS) {
            reader.readAsBinaryString(file);
        } else {
            reader.readAsArrayBuffer(file);
        };
    }

    useEffect(() => {
        if (file) {
          handleFile();
        }
      }, [file]);

      const Input = styled('input')({
        display: 'none',
      });



    return (
        <label htmlFor="icon-button-file">
        <Input accept={SheetJSFT} id="icon-button-file" type="file" onChange={(e) => handleChange(e)} />
        <IconButton
        color="primary"
        aria-label="upload picture"
        component="span"
        >
        <PostAddIcon />
        </IconButton>
        </label>
    )

}