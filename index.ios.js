/**
 * Photo Wall by React Native
 * https://github.com/trunk-studio/reactnative-photowall
 * @lyhcode
 */

import React, {
  ActivityIndicatorIOS,
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  TextInput,
  ListView,
  Image,
  View,
} from 'react-native';

var ParallaxView = require('react-native-parallax-view');

const __DEFAULT_KEYWORD = 'Taiwan';
const __DEFAULT_COVER_IMAGE_URL = 'https://c2.staticflickr.com/2/1531/26738924786_b6a3e94016_b.jpg';

class PhotoWall extends Component {

  constructor(props) {
    super(props)

    this.state = {
      dataSource: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      label: __DEFAULT_KEYWORD,
      isLoading: true,
      coverImage: {
        uri: __DEFAULT_COVER_IMAGE_URL
      }
    };

    this.onSearchChange = this.onSearchChange.bind(this);

    this.displayThumbs(__DEFAULT_KEYWORD);
  }

  onSearchChange(event) {
    var keyword = event.nativeEvent.text.toLowerCase();

    // if (keyword == '') {
    //   keyword = 'Taiwan';
    // }

    this.clearText();
    this.displayThumbs(keyword);
  }

  genFlickrQueryURL(keyword) {
    const BASE_URL = "https://api.flickr.com/services/rest/?&method=flickr.photos.search&format=json&nojsoncallback=1&per_page=300&api_key=b49d87bfd659c5768ab0eafa74f2b6a5&tags=";

    return BASE_URL + encodeURIComponent(keyword);
  }

  displayThumbs(keyword) {

    let queryURL = this.genFlickrQueryURL(keyword);

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows([]),
      isLoading: true,
      label: keyword,
    });

    fetch(queryURL)
    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.photos) {
        console.log(responseData.photos.photo.length);

        let photos = [];

        let coverImageUri = __DEFAULT_COVER_IMAGE_URL;

        for (var i=0; i < responseData.photos.photo.length; i++) {

          let photo = responseData.photos.photo[i];

          let photoUrl = 'https://farm'+photo.farm+'.staticflickr.com/'+photo.server+'/'+photo.id+'_'+photo.secret+'_m.jpg';

          if (i === 0) {
            coverImageUri = 'https://farm'+photo.farm+'.staticflickr.com/'+photo.server+'/'+photo.id+'_'+photo.secret+'.jpg';;
          }

          photos.push({
            photoUrl: photoUrl
          });
        }

        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(photos),
          coverImage: {
            uri: coverImageUri
          },
          isLoading: false,
        });
      }
    })
    .done();
  }

  clearText() {
    this._textInput.setNativeProps({text: ''});
  }

  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }

  render() {
    return (
      <ParallaxView
        backgroundSource={this.state.coverImage}
        windowHeight={250}
        header={(
          <View style={styles.header}>
            <Text style={styles.headerText}>
              {this.state.label}
            </Text>
            <Text style={styles.headerSubText}>
              Photo Wall | Flickr Quick Search
            </Text>
          </View>
        )}
        scrollableViewStyle={{ backgroundColor: 'red' }}>
        <View style={styles.container}>
          <TextInput
            ref={component => this._textInput = component}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Keyword..."
            style={styles.searchBarInput}
            onEndEditing={this.onSearchChange} />
          {this.renderLoading()}
          <ListView
            contentContainerStyle={styles.list}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
            initialListSize={21}
            pageSize={3}
            scrollRenderAheadDistance={500}
          />
        </View>
      </ParallaxView>
    );
  }

  renderLoading() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicatorIOS
            style={[styles.centering, {height: 100}]}
          />
        </View>
      );
    }
    return;
  }

  renderRow(row, sectionID, rowID) {
    return (
      <View>
        <Image style={styles.thumb} source={{uri: row.photoUrl}} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  searchBarInput: {
    padding: 5,
    margin: 5,
    fontSize: 15,
    height: 50,
    backgroundColor: '#EAEAEA',
  },
  coverContainer: {
    flex: 1,
    alignItems: 'stretch'
  },
  coverImage: {
    flex: 1,
  },
  header: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: '#333333',
    textShadowOffset: {width: 1, height: 1},
    textAlign: 'right',
    marginBottom: 10,
  },
  headerSubText: {
    fontSize: 16,
    color: '#ffffff',
    textShadowColor: '#333333',
    textShadowOffset: {width: 1, height: 1},
    textAlign: 'right',
  },
  list: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  row: {
    justifyContent: 'center',
    padding: 5,
    margin: 3,
    width: 100,
    height: 100,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#CCC'
  },
  thumb: {
    width: 100,
    height: 100,
    borderRadius: 3,
    margin: 2,
  }
});

AppRegistry.registerComponent('PhotoWall', () => PhotoWall);
