import React,{useState} from 'react'
import { FlatList, View, Text, Platform, StyleSheet } from 'react-native';
import { Card, CardItem, Button, Text as Nativetext, Footer, ListItem, Left, Right } from "native-base";
import Colors from "../../constants/Color";
import { MaterialIcons } from '@expo/vector-icons';


const OrdersItems=(props)=>{
    const [showdetail, setShowDetail] = useState(false)
    return (
        <View style={styles.cardStyle} >
          <Card style={styles.cardStyle} >
            <View style={styles.date}>
              <View style={{ flexDirection: 'row' }} >
                <Nativetext>RS:</Nativetext>
                <Nativetext style={{ color: Colors.primary }}>{props.totalAmount.toFixed(2)}</Nativetext>
              </View>
              <Nativetext style={{ color: '#888' }} >{props.readableDates}</Nativetext>
            </View>
            <View style={styles.buttons} >
              <Button iconLeft bordered success onPress={() => {
                setShowDetail((prev) => {
                  return (!prev)
                })
              }}   >
                <MaterialIcons name="description" size={24} color="black" />
                {showdetail?<Nativetext>Hide DetailS</Nativetext>:<Nativetext>Show DetailS</Nativetext>}
                
              </Button>
            </View>
            {showdetail && <View>
              {props.items.map((cartItem) => {
                return (
                  <ListItem key={cartItem.productId} >
                    <View style={styles.DetailView}>
                      <Left>
                        <Nativetext>{cartItem.productTitle}- </Nativetext>
                        <Nativetext style={{ color: '#888' }}>{cartItem.quantity}</Nativetext>
                      </Left>
                      <Right>
                        <Nativetext style={styles.sumAlign} >{cartItem.sum.toFixed(2)}</Nativetext>
                      </Right>
                    </View>
                  </ListItem>)
  
              }
              )}
            </View>}
          </Card >
        </View>)

}

const styles=StyleSheet.create({
    cardStyle: {
        margin: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
      },
      date: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
      buttons: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 15,
        marginTop: 15
      },
      DetailView: {
        marginLeft: 15,
        marginRight: 15,
        flexDirection: 'row',
      },
      sumAlign: {
        width: 180,
        textAlign: 'right'
      }

})

export default OrdersItems