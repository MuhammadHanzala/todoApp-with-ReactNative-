//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, ListView, Keyboard, AsyncStorage, ActivityIndicator} from 'react-native';
import Footer from './footer';
import Header from './header';
import Row  from './row';

const filterItems = (filter, items) => {
    return items.filter((item) => {
        if(filter === 'ALL') return true;
        if(filter === 'COMPLETED') return item.complete;
        if(filter === 'ACTIVE') return !item.complete;                
    })
}
// create a component
class App extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});
        this.state = {
            value: '',
            items: [],
            allComplete: false,
            dataSource: ds.cloneWithRows([]),
            filter: 'ALL',
            loading: true    
        }
    }
    componentWillMount() {
        AsyncStorage.getItem('items').then((json) => {
            try {
                const items = JSON.parse(json);
                this.setSource(items, items, {loading: false});
                console.log(items);
            } catch(e) {
                this.setState({
                    loading: false
                })
            }
        })
    }
    handleUpdateText = (key, text) => {
        const newItems = this.state.items.map((item) => {
            if(item.key !== key) return item;
            return {
                ...item,
                text
            }
        })
        this.setSource(newItems, filterItems(this.state.filter, newItems));
    }
    handleToggleEditing = (key, editing) => {
        const newItems = this.state.items.map((item) => {
            if(item.key !== key) return item;
            return {
                ...item,
                editing
            }
        })
        this.setSource(newItems, filterItems(this.state.filter, newItems));
    }
    setSource = (items, itemsDataSource, otherState = {}) => {
        this.setState({
            items,
            dataSource: this.state.dataSource.cloneWithRows(itemsDataSource),
            ...otherState
        })
        AsyncStorage.setItem("items", JSON.stringify(items));
    }
    handleToggleComplete = (key, complete) => {
        console.log(complete, key);
        const newItems = this.state.items.map((item) => {
            if(item.key !== key) return item;
            return {
                ...item,
                complete
            }
        })
        this.setSource(newItems, filterItems(this.state.filter, newItems));
    }
    handleRemoveItem = (key)  => {
        this.setState({loading: true})
        console.log(key);
        
        const newItems = this.state.items.filter((item) => {
            return item.key !== key;
        })
        this.setSource(newItems, filterItems(this.state.filter, newItems), {loading: false});
    }
    handleToggleAllComplete = () => {
        const complete = !this.state.allComplete;
        const newItems = this.state.items.map((item) => ({
            ...item,
            complete
        })
        )
        this.setSource(newItems, filterItems(this.state.filter, newItems), {allComplete: complete});
    }
    setText = (value) => {
        this.setState({
            value
        })
    }
    handleAddItem = () => {
        if (!this.state.value) return;
        const newItems = [
            ...this.state.items,
            {
                key: Date.now(),
                text: this.state.value,
                complete: false
            }
        ]
        this.setSource(newItems, filterItems(this.state.filter, newItems), {value: ""});
        
        console.log(newItems);
    }
    
    handleFilter= (filter) => {
        this.setSource(this.state.items, filterItems(filter, this.state.items), {filter});
    }
    handleClearComplete = () => {
        console.log('clear complete')
        const newItems = filterItems("ACTIVE", this.state.items);
        this.setSource(newItems, filterItems(this.state.filter, newItems));
    }
    render() {
        return (
            <View style={styles.container}>
                <Header
                    value={this.state.value}
                    onAddItem={this.handleAddItem}
                    onChange={(value) => this.setText(value)}
                    onToggleAllComplete = {this.handleToggleAllComplete}
                />
                 <View style = {styles.content}>
                    <ListView
                        style= {styles.list}
                        enableEmptySections
                        dataSource = {this.state.dataSource}
                        onScroll = { () => Keyboard.dismiss()}
                        renderRow = {({key, ...value}) => {
                            return (
                                <Row 
                                    key={key}
                                    onUpdate={(text) => this.handleUpdateText(key, text)}
                                    onToggleEdit={(editing) => this.handleToggleEditing(key, editing)}
                                    onRemove={() => this.handleRemoveItem(key)}
                                    onComplete = {(complete) => this.handleToggleComplete(key, complete)}
                                    {...value}
                                />
                            )
                        } }
                        renderSeparator ={(sectionId, rowId) => {
                            return <View key={rowId} style = {styles.separator}></View>
                        }} 
                    /> 
                </View>
                   <Footer
                    count={filterItems("ACTIVE", this.state.items).length}
                    filter={this.state.filter}
                    onClearComplete={() => this.handleClearComplete()}
                    onFilter = {(filter) =>  this.handleFilter(filter)}
                   />  
                    {this.state.loading ? <View style={styles.loading}>
                        <ActivityIndicator
                            animating
                            size="large"
                         />
                   </View> : null} 
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    content: {
        flex: 1
    },
    list: {
        backgroundColor: '#FFF'
    },
    separator: {
        borderWidth: 1,
        borderColor: '#F5F5F5'

    },
    loading: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, .3)'
    }
});

//make this component available to the app
export default App;
