'use strict';

var moment = require('moment');
var React = require('react-native');
var Styles = require('../styles/Styles');

var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;

var { DatePickerIOS, Modal, Text, TextInput, TouchableHighlight, View } = React;

var Create = React.createClass({
    
    // -------------
    // Init
    // -------------

    getDefaultProps() {
        return {
          date: new Date()
        };
    },

    getInitialState() {
        return {
            showModal: false,
            date: this.props.date,
            text: '',
            keyboardSpace: 0
        }
    },

    // --------------
    // Keyboard space
    // --------------

    componentDidMount() {
        KeyboardEventEmitter.on(KeyboardEvents.KeyboardDidShowEvent, this.updateKeyboardSpace);
        KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
    },

    componentWillUnmount() {
        KeyboardEventEmitter.off(KeyboardEvents.KeyboardDidShowEvent, this.updateKeyboardSpace);
        KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
    },

    updateKeyboardSpace(frames) {
        if (frames.end) {
            this.setState({keyboardSpace: frames.end.height});
        } else {
            this.setState({keyboardSpace: frames.endCoordinates.height});
        }        
    },

    resetKeyboardSpace() {
        this.setState({keyboardSpace: 0});
    },

    // ----------
    // Datepicker 
    // ----------

    onDateChange(date) {
        this.setState({date: date});
    },

    onDateSet() {
        this.hideModal();
        this.setState({
            dueDate: this.state.date
        });
    },

    onDateReset() {
        this.hideModal();
        this.setState({ dueDate: null });
    },

    // -------------
    // Modal 
    // -------------

    showModal() {
        this.setState({showModal: true})
    },

    hideModal() {
        this.setState({showModal: false})
    },

    // -------------
    // Submit 
    // -------------
    
    saveTask() {
        if (this.state.text) {
            this.refs['textInput'].value = '';
            this.props.onSubmit({text: this.state.text, due: this.state.dueDate});
            this.setState({text: '', dueDate: new Date()});
        }
    },
    
    render() {
        return (
            <View style={[Styles.screen, Styles.form, {alignItems: 'stretch'}]}>
                <Modal
                    animated={true}
                    transparent={true}
                    visible={this.state.showModal}>
                    <DatePicker
                        date={this.state.date}
                        onDateSet={this.onDateSet}
                        onDateReset={this.onDateReset}
                        onDateChange={this.onDateChange} />
                </Modal>
                <TextInput
                    ref='textInput'
                    autoFocus={true}
                    multiline={true}
                    numberOfLines={3}
                    onChangeText={(text) => this.setState({text})}
                    style={Styles.formInput} 
                    placeholder='What would you like to to?' />
                <View style={Styles.buttonGroup}>
                    <TouchableHighlight
                        style={[Styles.button, Styles.inlineButton, Styles.secondaryButton]}
                        onPress={this.showModal}
                        underlayColor='#EEEEEE'>
                        <Text style={[Styles.buttonText, Styles.secondaryButtonText]}>
                            {this.state.dueDate ? moment(this.state.dueDate).format('DD/MM') : "DUE DATE"}
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={[Styles.button, Styles.inlineButton]}
                        onPress={this.saveTask}
                        underlayColor='#D1DBFC'>
                        <Text style={Styles.buttonText}>
                            SAVE
                        </Text>
                    </TouchableHighlight>
                </View>
                <View style={{height: this.state.keyboardSpace - 20}}></View>
            </View>
        )
    }
});

var DatePicker = React.createClass({
    render() {
        return (
            <View style={Styles.datePicker}>
                <Text style={Styles.message}>Set due date</Text>
                <DatePickerIOS
                    date={this.props.date}
                    mode="date"
                    onDateChange={this.props.onDateChange} />
                <View style={Styles.buttonGroup}>
                    <TouchableHighlight
                        style={[Styles.button, Styles.inlineButton, Styles.secondaryButton]}
                        onPress={this.props.onDateReset}
                        underlayColor='#EEEEEE'>
                        <Text style={[Styles.buttonText, Styles.secondaryButtonText]}>CLEAR</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={[Styles.button, Styles.inlineButton]}
                        onPress={this.props.onDateSet}
                        underlayColor='#D1DBFC'>
                        <Text style={Styles.buttonText}>OK</Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }    
});

module.exports = Create;
