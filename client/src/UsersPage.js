import React, {Component} from 'react'
import UsersModel from './UsersModel'
import UsersTable from './UsersTable'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Snackbar from "@material-ui/core/Snackbar";
import {IconButton} from "@material-ui/core";

const api = 'http://localhost:8081';


class UsersPage extends Component {
    constructor() {
        super();
        this.getItems = this.getItems.bind(this);
    }

    state = {
        items: [],
        count: 0,
        snackbaropen: false,
        snackbarmsg: '',
    }
    SnackbarClose = (event) => {
        this.setState({
            snackbaropen: false,
            snackbarmsg: '',
        });
    };

    openSnackbar = ({message}) => {
        this.setState({open: true, message});
    };

    getItems(page, limit, sort, order, filter) {
        let params = {
            "page": page ? page : "0",
            "limit": limit ? limit : "10",
            "sort": sort ? sort : 'first',
            "order": order === 'desc' ? -1 : 1,
            "filter": filter ? filter : ''
        }

        let query = Object.keys(params)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
            .join('&');

        let url = `${api}/api/user?${query}`
        fetch(url)
            .then(response => response.json())
            .then(res => {
                this.setState({
                    items: res.docs,
                    count: res.count,
                });
                console.log('responce', res);
                console.log('state', this.state.items);

            })
            .catch(err => console.log(err))
    }

    addItemToState = (item) => {
        this.setState(prevState => ({
            items: [...prevState.items, item]
        }))
        console.log('the item after loaded', this.state.items);
        this.setState({snackbaropen: true, snackbarmsg: 'User Added Sucessfully'});
        this.getItems()
    }

    updateState = (item) => {
        this.setState(...this.state.items.splice(this.state.items.indexOf(item.id), 1, item))
        this.setState({snackbaropen: true, snackbarmsg: 'User updated Sucessfully'});
        this.getItems()
    }

    deleteItemFromState = (_id) => {
        this.setState({items: (this.state.items.filter(item => item._id !== _id))})
        this.setState({snackbaropen: true, snackbarmsg: 'User Deleted Sucessfully'});
        this.getItems()

    }

    componentDidMount() {
        this.getItems()
    }

    render() {
        return (
            <Card style={{maxWidth: '100%', marginLeft: 20}}>
                <CardContent>
                    <Snackbar
                        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                        message={<span id='message-id'>{this.state.snackbarmsg}</span>}
                        autoHideDuration={3000}
                        onClose={this.SnackbarClose}
                        open={this.state.snackbaropen}
                        ContentProps={{
                            'aria-describedby': 'snackbar-message-id',
                        }}
                        action={[
                            <IconButton
                                key="close"
                                aria-label="close"
                                color='inherit'
                                onClick={this.SnackbarClose}
                            > x </IconButton>
                        ]}
                    />
                    <Typography gutterBottom variant="h5" component="h2">
                        CRUD User Application
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        <UsersTable items={this.state.items} count={this.state.count} getItems={this.getItems}
                                    updateState={this.updateState} deleteItemFromState={this.deleteItemFromState}/>

                    </Typography>
                </CardContent>
                <CardActions>
                    <UsersModel items={this.state.items} count={this.state.count} buttonLabel="Add User"
                                addItemToState={this.addItemToState}/>
                </CardActions>
            </Card>
        )
    }
}

export default UsersPage
