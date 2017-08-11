//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

// create a component
class Header extends Component {
    render() {
        return (
            <View>
                <View style={styles.viewStyle}>
                    <Text style={{ fontSize: 25 }}>Todo App</Text>
                </View>
                <View style={styles.container}>
                    <TouchableOpacity onPress={this.props.onToggleAllComplete}>
                        <Text style={styles.toggleIcon}>{String.fromCharCode(10003)}</Text>
                    </TouchableOpacity>
                    <TextInput
                        value={this.props.value}
                        onChangeText={this.props.onChange}
                        onSubmitEditing={this.props.onAddItem}
                        placeholder="What needs to be done?"
                        blurOnSubmit={false}
                        returnKeyType="done"
                        style={styles.input}
                    />
                    <TouchableOpacity style={styles.button} onPress={this.props.onAddItem}>
                        <Text>Add</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 50
    },
    toggleIcon: {
        flexDirection: 'row',
        fontSize: 25,
        color: '#CCC',
        marginRight: 12,
        paddingTop: 12,
        justifyContent: 'space-between',
    },
    button: {
        padding: 8,
        borderWidth: 1,        
        borderColor: 'rgba(175, 47, 47, 0.2)',
        borderRadius: 5
    },
    viewStyle: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        paddingTop: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, hieght: 2 },
        shadowOpacity: .2,
        elevation: 2,
        position: 'relative'
    }
});

//make this component available to the app
export default Header;
