import {
  View,
  Pressable,
  StyleSheet,
  TextInput,
  ScrollView,
  Platform,
  Keyboard,
  Image,
  StatusBar,
  Text,
  Alert,
} from 'react-native';
import CommunityWriteTripCard from '../../components/CommunityWriteTripCard';
import { colors } from '../../styles/colors';
import CameraBottomBar from '../../components/CameraBottomBar';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CommunityWrite({ route, navigation }) {
  const { tripData } = route.params || {};
  const [selectedImages, setSelectedImages] = useState([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleUpload = async () => {
    if (!title.trim()) {
      Alert.alert('알림', '제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      Alert.alert('알림', '내용을 입력해주세요.');
      return;
    }

    try {
      const newPost = {
        id: Date.now(),
        nickname: '나의 닉네임',
        date: new Date().toLocaleDateString().replace(/\./g, '.').replace(/ /g, ''),
        title: title,
        content: content,
        images: selectedImages,
        tripData: tripData,
        location: tripData?.location || '위치 정보 없음',
        startDate: tripData?.startDate,
        endDate: tripData?.endDate,
        circleColor: tripData?.circleColor,
        hCount: 0,
        cCount: 0,
      };

      const existingDataJson = await AsyncStorage.getItem('community_data');
      const existingData = existingDataJson ? JSON.parse(existingDataJson) : [];
      const updatedData = [newPost, ...existingData];
      await AsyncStorage.setItem('community_data', JSON.stringify(updatedData));
      console.log('저장 완료:', newPost);
      Alert.alert('성공', '게시글이 등록되었습니다.', [
        {
          text: '확인',
          onPress: () => navigation.navigate('BottomTab'),
        },
      ]);
    } catch (e) {
      console.error('저장 실패:', e);
      Alert.alert('오류', '게시글 저장 중 문제가 발생했습니다.');
    }
  };

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, (e) => {
      const adjustment = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
      setKeyboardHeight(e.endCoordinates.height + adjustment);
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable>
          <Text
            style={{
              paddingLeft: 10,
              fontFamily: 'Pretendard-Regular',
              color: colors.grayscale[700],
              fontSize: 16,
            }}
          >
            취소
          </Text>
        </Pressable>
      ),
      headerRight: () => (
        <Pressable onPress={handleUpload}>
          <Text
            style={{
              paddingRight: 10,
              fontFamily: 'Pretendard-Regular',
              color: colors.grayscale[700],
              fontSize: 16,
            }}
          >
            등록
          </Text>
        </Pressable>
      ),
    });
  });

  // 이미지 피커 갤러리 접근 권한 확인 및 요청
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('갤러리 접근이 필요합니다!');
      return false;
    }
    return true;
  };

  // 이미지 선택
  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'livePhotos', 'videos'],
      allowsMultipleSelection: true,
      selectionLimit: 10,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setSelectedImages((prev) => [...prev, ...uris]);
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={keyboardHeight > 0 ? ['left', 'right'] : ['bottom', 'left', 'right']}
    >
      <Pressable style={styles.container} onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 100 }}
            style={styles.container}
            bounces={false}
            overScrollMode="never"
            automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
          >
            <View>
              <CommunityWriteTripCard data={tripData} />
            </View>
            <View style={styles.titleContainer}>
              <TextInput
                style={styles.title}
                placeholder="제목을 입력해주세요."
                value={title}
                onChangeText={setTitle}
              />
            </View>
            <View style={styles.contentContainer}>
              <TextInput
                style={styles.content}
                placeholder="Travodo와 계획했던 즐거운 여행을 공유해보세요!"
                multiline={true}
                value={content}
                onChangeText={setContent}
              />
            </View>
            <View style={styles.gridContainer}>
              {selectedImages.map((uri, index) => (
                <View key={index} style={styles.imageBox}>
                  <Image source={{ uri }} style={styles.squareImage} />
                  <Pressable
                    style={styles.deleteBadge}
                    onPress={() => setSelectedImages(selectedImages.filter((_, i) => i !== index))}
                  >
                    <Text style={styles.deleteText}>×</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </ScrollView>
          <View style={[styles.bottomBarWrapper, { bottom: keyboardHeight }]}>
            <CameraBottomBar onCameraPress={pickImage} />
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: -100,
              left: 0,
              right: 0,
              height: 100,
              backgroundColor: '#fff',
            }}
          />
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 20,
  },
  titleContainer: {
    height: 64,
    justifyContent: 'center',
    width: '90%',
    marginHorizontal: 23,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayscale[500],
  },
  contentContainer: {
    marginTop: 20,
    width: '90%',
    marginHorizontal: 23,
    minHeight: 200,
  },
  content: {
    fontFamily: 'Pretendrd-Regular',
    fontSize: 14,
    paddingBottom: 20,
  },
  bottomBarWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
    backgroundColor: '#fff',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  imageBox: {
    width: 160,
    height: 160,
    margin: 8,
    position: 'relative',
  },
  squareImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  deleteBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
  },
});

export default CommunityWrite;
