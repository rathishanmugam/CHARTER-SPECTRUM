import React, {useState} from 'react';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import {withStyles} from '@material-ui/core/styles';
import TableHead from '@material-ui/core/TableHead';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import UsersModel from './UsersModel'

const api = 'http://localhost:8081';

const useStyles1 = makeStyles(theme => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing(2.5),
    },
}));
const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        minWidth: 120,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));
const useStyles2 = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    table: {
        minWidth: 500,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
}));

function TablePaginationActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const {count, page, rowsPerPage, onChangePage} = props;

    function handleFirstPageButtonClick(event) {
        onChangePage(event, 0);
    }

    function handleBackButtonClick(event) {
        onChangePage(event, page - 1);
    }

    function handleNextButtonClick(event) {
        onChangePage(event, page + 1);
    }

    function handleLastPageButtonClick(event) {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    }

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon/> : <FirstPageIcon/>}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon/> : <LastPageIcon/>}
            </IconButton>
        </div>
    );
}


const UsersTable = ({
                        items,
                        count,
                        updateState,
                        getItems,
                        deleteItemFromState,
                    }) => {
    const classes = useStyles2();
    const classs = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [col, setCol] = useState({
        colToSort: 'first',
        sortDir: 'asc',
        reverse: true,
        query: '',
        filter: ''
    });
    const [values, setValues] = React.useState({
        first: '',
        last: '',
        location: '',
        email: '',
        hobby: ''
    });


    // const emptyRows = rowsPerPage - Math.min(rowsPerPage, parseInt(count, 10) - page * rowsPerPage);

    function handleChangePage(event, newPage) {
        console.log('the new page , rows per page :', newPage, rowsPerPage, col.colToSort, col.filter);
        setPage(newPage);
        getItems(newPage, rowsPerPage, col.colToSort, col.sortDir, col.filter);
    }

    function handleChangeRowsPerPage(event) {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
        console.log('the new selection and page :', (parseInt(event.target.value, 10)), 0, col.colToSort, col.filter);

        getItems(0, parseInt(event.target.value, 10), col.colToSort, col.sortDir, col.filter);

    }


    const StyledTableCell = withStyles(theme => ({
        head: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }))(TableCell);

    const StyledTableRow = withStyles(theme => ({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.background.default,
            },
        },
    }))(TableRow);

    const handleSort = (colName) => {
        setCol({
            ...col,
            colToSort: colName,
            reverse: !col.reverse,
        });
        setPage(0);
        console.log('the col to sort and order ', colName, col.filter);
        getItems(0, rowsPerPage, colName, col.reverse ? 'desc' : 'asc', col.filter);
    }
    const handleChange = name => event => {
        setValues({...values, [name]: event.target.value.toLowerCase()});
        setCol({
            ...col,
            filter: event.target.value ? event.target.value.toLowerCase() : ''
        });
        getItems(0, rowsPerPage, col.colToSort, col.reverse ? 'desc' : 'asc', event.target.value.toLowerCase());

    };

    const deleteItem = _id => {
        let confirmDelete = window.confirm('Delete item forever?')
        if (confirmDelete) {
            fetch(`${api}/api/user/${_id}`, {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    _id
                })
            })
                .then(response => response.json())
                .then(item => {
                    deleteItemFromState(_id)
                })
                .catch(err => console.log(err))
        }

    }


    return (
        <Paper className={classes.root}>
            <div className={classes.tableWrapper}>
                <form className={classes.container} noValidate autoComplete="off">
                    <FormControl className={classs.formControl}>
                        <TextField
                            id="name"
                            label="Type Name"
                            defaultValue="ALL"
                            className={classs.textField}
                            value={values.name}
                            onChange={handleChange()}
                            margin="normal"
                        />
                    </FormControl>
                </form>

                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center" onClick={() => handleSort('first')}>first
                                <span>{col.colToSort === 'first' ?
                                    (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span>
                            </StyledTableCell>
                            <StyledTableCell align="center" onClick={() => handleSort('last')}>last
                                <span>{col.colToSort === 'last' ?
                                    (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span>
                            </StyledTableCell>
                            <StyledTableCell align="center">email
                            </StyledTableCell>
                            <StyledTableCell align="center">phone
                            </StyledTableCell>
                            <StyledTableCell align="center" onClick={() => handleSort('location')}>location
                                <span>{col.colToSort === 'location' ?
                                    (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span>
                            </StyledTableCell>
                            <StyledTableCell align="center" onClick={() => handleSort('hobby')}>hobby
                                <span>{col.colToSort === 'hobby' ?
                                    (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span>
                            </StyledTableCell>
                            <StyledTableCell align="left">Actions</StyledTableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            (items.length > 0) ? (
                                items.map(row => (
                                    <StyledTableRow key={row._id}>
                                        <StyledTableCell component="th" scope="row">
                                            {row.first}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">{row.last}</StyledTableCell>
                                        <StyledTableCell align="center">{row.email}</StyledTableCell>
                                        <StyledTableCell align="center">{row.phone}</StyledTableCell>
                                        <StyledTableCell align="center">{row.location}</StyledTableCell>
                                        <StyledTableCell align="center">{row.hobby}</StyledTableCell>
                                        <StyledTableCell align="center" style={{width: "130px"}}>
                                            <UsersModel buttonLabel="Edit" item={row} updateState={updateState}/>{' '}
                                            <DeleteForeverIcon color="error" onClick={() => deleteItem(row._id)}/>
                                        </StyledTableCell>
                                    </StyledTableRow>

                                ))
                            ) : (
                                <div align="center"> Sorry.No results found for your selection .</div>
                            )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[2,3,4,5, 15, 12, 20]}
                                colSpan={3}
                                count={items.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: {'aria-label': 'rows per page'},
                                    native: true,
                                }}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </Paper>
    );
}

export default UsersTable;
