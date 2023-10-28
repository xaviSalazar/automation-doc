import { writeFile, utils } from 'xlsx';

export const downloadExcel = (data) => {
        const worksheet = utils.json_to_sheet(data);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Sheet1");
        //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
        //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
        writeFile(workbook, "DataSheet.xlsx");
      };

