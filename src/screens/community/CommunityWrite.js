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
  Animated,
  Dimensions,
} from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CommunityWriteTripCard from '../../components/CommunityWriteTripCard';
import CameraBottomBar from '../../components/CameraBottomBar';
import ToggleSwitch from '../../components/ToggleSwitch';
import { colors } from '../../styles/colors';

const SCREEN_HEIGHT = Dimensions.get('window').height;

function CommunityWrite({ route, navigation }) {
  const tripData = route?.params?.tripData ?? null;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const sheetAnim = useRef(new Animated.Value(SCREEN_HEIGHT + 100)).current;

  const openSetting = () => {
    setIsSettingOpen(true);
    Animated.timing(sheetAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeSetting = () => {
    Animated.timing(sheetAnim, {
      toValue: SCREEN_HEIGHT + 100,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setIsSettingOpen(false));
  };

  useEffect(() => {
  setTimeout(() => {
    setIsSettingOpen(true);
    Animated.timing(sheetAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, 1000);
}, []);


  useEffect(() => {
  navigation.setOptions({
    headerTitle: () => (
      <View style={styles.headerTitleWrapper}>
        <Pressable onPress={openSetting}>
          <Text style={styles.headerTitle}>설정</Text>
        </Pressable>
      </View>
    ),
    headerLeft: () => (
      <Pressable>
        <Text style={styles.headerText}>취소</Text>
      </Pressable>
    ),
    headerRight: () => (
      <Pressable onPress={handleUpload}>
        <Text style={styles.headerText}>등록</Text>
      </Pressable>
    ),
  });
}, []);


  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      const offset = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
      setKeyboardHeight(e.endCoordinates.height + offset);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      selectionLimit: 10,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      setSelectedImages((prev) => [...prev, ...uris]);
    }
  };

  async function handleUpload() {
    if (!title.trim() || !content.trim()) {
      Alert.alert('알림', '제목과 내용을 입력해주세요.');
      return;
    }

    const newPost = {
      id: Date.now(),
      title,
      content,
      images: selectedImages,
      tripData,
      createdAt: new Date().toISOString(),
    };

    const stored = await AsyncStorage.getItem('community_data');
    const list = stored ? JSON.parse(stored) : [];
    await AsyncStorage.setItem('community_data', JSON.stringify([newPost, ...list]));

    Alert.alert('완료', '게시글이 등록되었습니다.', [
      { text: '확인', onPress: () => navigation.navigate('BottomTab') },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
            <CommunityWriteTripCard data={tripData} />

            <View style={styles.titleBox}>
              <TextInput
                placeholder="제목을 입력해주세요."
                style={styles.title}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.contentBox}>
              <TextInput
                placeholder="Travodo와 함께한 여행을 공유해보세요!"
                multiline
                style={styles.content}
                value={content}
                onChangeText={setContent}
              />
            </View>

            <View style={styles.imageGrid}>
              {selectedImages.map((uri, idx) => (
                <View key={idx} style={styles.imageBox}>
                  <Image source={{ uri }} style={styles.image} />
                  <Pressable
                    style={styles.delete}
                    onPress={() =>
                      setSelectedImages(selectedImages.filter((_, i) => i !== idx))
                    }
                  >
                    <Text style={{ color: '#fff' }}>×</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </ScrollView>
        </Pressable>

        <View style={[styles.bottomBar, { bottom: keyboardHeight }]}>
          <CameraBottomBar onCameraPress={pickImage} onMorePress={openSetting} />
        </View>
      </View>

      {isSettingOpen && (
        <View style={styles.modalOverlay}>
          <Pressable style={styles.backdrop} onPress={closeSetting} />

          <Animated.View
            style={[
              styles.bottomSheet,
              { transform: [{ translateY: sheetAnim }] },
            ]}
          >
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>설정</Text>
              <Pressable onPress={closeSetting}>
                <Text style={{ fontSize: 18 }}>✕</Text>
              </Pressable>
            </View>

            <Pressable style={styles.sheetRow}>
              <Text style={styles.sheetLabel}>태그 선택</Text>
              <Text style={styles.arrow}>›</Text>
            </Pressable>

            <View style={styles.sheetRow}>
              <Text style={styles.sheetLabel}>댓글 허용</Text>
              <ToggleSwitch />
            </View>

            <View style={styles.sheetRow}>
              <Text style={styles.sheetLabel}>공감 허용</Text>
              <ToggleSwitch />
            </View>
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
}

export default CommunityWrite;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  headerText: {
    paddingHorizontal: 10,
    fontSize: 16,
    color: colors.grayscale[700],
    fontFamily: 'Pretendard-Regular',
  },

  titleBox: {
    borderBottomWidth: 1,
    borderColor: colors.grayscale[400],
    margin: 20,
  },
  title: { fontSize: 20, fontFamily: 'Pretendard-SemiBold' },

  contentBox: { marginHorizontal: 20, minHeight: 200 },
  content: { fontSize: 14, fontFamily: 'Pretendard-Regular' },

  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  imageBox: { width: 150, height: 150, margin: 6 },
  image: { width: '100%', height: '100%', borderRadius: 12 },
  delete: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomBar: { position: 'absolute', left: 0, right: 0 },

  modalOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },

  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 60,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: colors.grayscale[300],
  },
  sheetTitle: { fontSize: 16, fontFamily: 'Pretendard-SemiBold' },
  sheetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: colors.grayscale[200],
  },
  sheetLabel: { fontSize: 14 },
  arrow: { fontSize: 18, color: colors.grayscale[500] },

  headerTitleWrapper: {
  position: 'absolute',
  left: 0,
  right: 0,
  alignItems: 'center',
},

headerTitle: {
  fontSize: 16,
  fontFamily: 'Pretendard-SemiBold',
  color: colors.grayscale[900],
},

headerText: {
  paddingHorizontal: 10,
  fontSize: 16,
  fontFamily: 'Pretendard-Regular',
  color: colors.grayscale[700],
},

});