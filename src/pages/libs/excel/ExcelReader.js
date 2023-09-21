import React, { useState, useRef, useEffect } from 'react';
import {
    Button,
} from '@mui/material';
// excel data types
import { SheetJSFT } from './types';
// xlsx
import { read, utils } from 'xlsx';
import { make_cols } from './MakeColumns';
import Iconify from '../../../components/iconify/Iconify';

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



    return (
        <Button variant="contained" component="label" startIcon={<Iconify icon="eva:plus-fill" />}>
            Agregar excel
            <input
                id="fileUpload"
                type="file"
                accept={SheetJSFT}
                hidden
                onChange={(e) => handleChange(e)}
            />
        </Button>
    )

}