import { View, Text, Pressable, StyleSheet, Image, ScrollView } from 'react-native';
import CommunityTripPlan from '../../components/CommunityTripPlan';
import ProfileImage from '../../components/ProfileImage';
import { colors } from '../../styles/colors';
import DotButton from '../../components/DotButton';
import ImageGrid from '../../components/ImageGrid';
import trip1 from '../../../assets/data/tripimage1.png';
import Heart from '../../components/Heart';
import Comment from '../../components/Comment';
import CommentItem from '../../components/CommentItem';

function CommunityContent() {
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <ProfileImage size={25} />
        <Text style={styles.nickname}>여행고고</Text>
        <Text style={styles.date}>2주 전</Text>
        <View style={styles.button}>
          <DotButton />
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>가평 익스트림 클리어!</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.content}>
          안녕하세요. {'\n'}대학 동기 4명이서 2박 3일 가평을 빡세게 찍고 왔습니다!{'\n'}저희 모두
          mbti P였지만, Travodo 덕분에 무사히 여행을 마쳤습니다.{'\n'}저희의 계획 공유해드릴게요!
        </Text>
      </View>
      <View style={styles.tripplan}>
        <CommunityTripPlan
          title={'가평 익스트림 클리어!'}
          date={'2025.09.03 - 2025.09.05'}
          location={'경기도 가평군'}
          people={'4인'}
          todo={'어쩌구 저쩌구'}
        />
      </View>
      <View style={styles.imageContainer}>
        <ImageGrid imageName={'image1'} />
        <ImageGrid imageName={'image2'} />
      </View>
      <View style={styles.heartncomment}>
        <Heart size={15} count={'584'} />
        <Comment size={15} count={'12'} />
      </View>
      <View>
        <CommentItem />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    gap: 12,
  },
  profileContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    marginLeft: 26,
    alignItems: 'center',
  },
  nickname: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
  },
  date: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    color: colors.grayscale[800],
  },
  button: {
    position: 'absolute',
    marginLeft: 350,
    backgroundColor: '#fff',
  },
  contentContainer: {
    marginHorizontal: 26,
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 22,
  },
  content: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
  },
  tripplan: {
    alignItems: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'center',
    marginBottom: 15,
  },
  heartncomment: {
    flexDirection: 'row',
    gap: 35,
    marginHorizontal: 26,
  },
});

export default CommunityContent;
