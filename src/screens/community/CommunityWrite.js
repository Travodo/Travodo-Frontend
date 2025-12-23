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
  Modal,
} from 'react-native';
import { useEffect, useState, useRef } from 'react';
import * as ImagePicker from 'expo-image-picker';

import CommunityWriteTripCard from '../../components/CommunityWriteTripCard';
import CameraBottomBar from '../../components/CameraBottomBar';
import ToggleSwitch from '../../components/ToggleSwitch';
import { colors } from '../../styles/colors';
import Close from '../../../assets/ComponentsImage/Close.svg';
import Categories from '../../components/Categories';
import { createCommunityPost } from '../../services/api';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const TAG_LIST = [
  '휴양 / 힐링',
  '액티비티',
  '역사 / 문화',
  '쇼핑',
  '자연 / 캠핑',
  '호캉스',
  '미식',
  'asd',
  'aasd',
  'asdasdasd',
  'asdasd',
];

function CommunityWrite({ route, navigation }) {
  const tripData = route?.params?.tripData ?? null;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [visibleModal, setVisibleModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
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
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.headerText}>취소</Text>
        </Pressable>
      ),
      headerRight: () => (
        <Pressable onPress={handleUpload}>
          <Text style={styles.headerText}>등록</Text>
        </Pressable>
      ),
    });
  }, [navigation, title, content, selectedImages]);

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

    // UI 태그 → 서버 TravelTag 매핑 (최소한의 매핑)
    const mapTag = (t) => {
      if (t.includes('휴양') || t.includes('힐링') || t.includes('호캉스')) return 'RELAXATION';
      if (t.includes('친구') || t.includes('지인')) return 'FRIEND';
      if (t.includes('커플') || t.includes('연인')) return 'COUPLE';
      if (t.includes('가족') || t.includes('친지')) return 'FAMILY';
      return 'SOLO';
    };
    const tags = selectedTags.map(mapTag);

    await createCommunityPost({
      title,
      content,
      tags,
      tripId: tripData?.tripId ?? tripData?.id,
      imageUris: selectedImages,
    });

    Alert.alert('완료', '게시글이 등록되었습니다.', [{ text: '확인', onPress: () => navigation.navigate('BottomTab') }]);
  }

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <View style={styles.container}>
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
                    onPress={() => setSelectedImages(selectedImages.filter((_, i) => i !== idx))}
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
          <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: sheetAnim }] }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>설정</Text>
              <Pressable onPress={closeSetting}>
                <Text style={{ fontSize: 18 }}>✕</Text>
              </Pressable>
            </View>
            <Pressable style={styles.sheetRow} onPress={() => setVisibleModal(true)}>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={visibleModal}
        onRequestClose={() => {
          setVisibleModal(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalbox}>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>태그 선택</Text>
              <View style={styles.closeStyle}>
                <Pressable onPress={() => setVisibleModal(false)}>
                  <Close width={15} height={15} />
                </Pressable>
              </View>
            </View>
            <View style={styles.tagSection}>
              <Text style={styles.sectionTitle}>여행 스타일</Text>
              <View style={styles.tagContainer}>
                {TAG_LIST.map((tag) => (
                  <Categories
                    key={tag}
                    property={tag}
                    disable={selectedTags.includes(tag)}
                    onPress={() => toggleTag(tag)}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default CommunityWrite;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 35 : 0,
  },

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
    paddingBottom: Platform.OS === 'android' ? 0 : 20,
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
    bottom: 0,
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalbox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 46,
  },
  closeStyle: {
    position: 'absolute',
    right: 20,
  },
  scrapText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
  },
  scrapContainer: {
    flexDirection: 'row',
    gap: 20,
    paddingLeft: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.grayscale[300],
    width: '100%',
    paddingVertical: 12.5,
  },
  report: {
    color: '#e71e25',
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
  },
  modalTitle: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
  },
  modalTitleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 18.5,
  },
  tagSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: colors.grayscale[200],
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: colors.grayscale[900],
    marginBottom: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
});
