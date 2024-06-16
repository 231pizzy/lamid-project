export default function checkboxSelection(params) {
    return params.columnApi.getRowGroupColumns().length === 0;
}