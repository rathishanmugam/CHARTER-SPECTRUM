import React from 'react';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Button from '@material-ui/core/Button';

const api =  'http://localhost:8081';


class UsersForm extends React.Component {
    state = {
        id: 0,
        first: '',
        last: '',
        email: '',
        phone: '',
        location: '',
        hobby: '',
        added: ''

    }

    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    }

    submitFormAdd = e => {
        e.preventDefault()
        const id = parseInt(this.props.count, 10) + 1
        this.setState({id});
        fetch(`${api}/api/user`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.state.id,
                first: this.state.first,
                last: this.state.last,
                email: this.state.email,
                phone: this.state.phone,
                location: this.state.location,
                hobby: this.state.hobby,
                added: new Date().toLocaleDateString(),
            })
        })
            .then(response => response.json())
            .then(data => {
                this.setState({data})
                console.log('the saved item', {data});
                this.props.addItemToState(this.state)
                console.log('the saved item', this.state);
                this.props.toggle()

            })
            .catch(err => console.log(err))
    }

    submitFormEdit = e => {
        e.preventDefault()
        fetch(`${api}/api/user/${this.props.item._id}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.state.id,
                first: this.state.first,
                last: this.state.last,
                email: this.state.email,
                phone: this.state.phone,
                location: this.state.location,
                hobby: this.state.hobby,
                added: new Date().toLocaleDateString(),
            })
        })
            .then(response => response.json())
            .then(data => {
                this.setState({data})
                this.props.updateState(this.state)
                console.log('the updated item', {data});
                this.props.toggle()

            })
            .catch(err => console.log(err))
    }

    componentDidMount() {
        // if item exists, populate the state with proper data
        if (this.props.item) {
            const {id, first, last, email, phone, location, hobby} = this.props.item
            this.setState({id, first, last, email, phone, location, hobby})
        }
    }

    render() {
        return (
            <ValidatorForm
                onSubmit={this.props.item ? this.submitFormEdit : this.submitFormAdd}
            >
                <TextValidator
                    label="first"
                    onChange={this.onChange}
                    name="first"
                    value={this.state.first === null ? '' : this.state.first}
                    validators={['required']}
                    errorMessages={['first name field is required']}
                />
                <br/>
                <TextValidator
                    label="last"
                    onChange={this.onChange}
                    name="last"
                    value={this.state.last === null ? '' : this.state.last}
                    validators={['required']}
                    errorMessages={['last name field is required']}
                />
                <br/>
                <TextValidator
                    label="Email"
                    onChange={this.onChange}
                    name="email"
                    value={this.state.email === null ? '' : this.state.email}
                    validators={['required', 'isEmail']}
                    errorMessages={['this field is required', 'email is not valid']}
                />
                <br/>
                <TextValidator
                    label="phone"
                    onChange={this.onChange}
                    name="phone"
                    value={this.state.phone === null ? '' : this.state.phone}
                    validators={['required', 'minNumber:0']}
                    errorMessages={['this field is required', 'min 8 digit']}
                />
                <br/>
                <TextValidator
                    label="location"
                    onChange={this.onChange}
                    name="location"
                    value={this.state.location === null ? '' : this.state.location}
                    validators={['required']}
                    errorMessages={['location field is required']}
                />
                <br/>
                <TextValidator
                    label="hobby"
                    onChange={this.onChange}
                    name="hobby"
                    value={this.state.hobby === null ? '' : this.state.hobby}
                    validators={['required']}
                    errorMessages={['hobby field is required']}
                />
                <br/>
                <br/>
                <Button variant="contained" color="primary" type="submit">Submit</Button>
            </ValidatorForm>

        );
    }
}

export default UsersForm
