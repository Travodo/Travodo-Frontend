import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CommunityTripPlan from '../../components/CommunityTripPlan';
import ProfileImage from '../../components/ProfileImage';
import { colors } from '../../styles/colors';
import DotButton from '../../components/DotButton';
import ImageGrid from '../../components/ImageGrid';
import Heart from '../../components/Heart';
import Comment from '../../components/Comment';
import CommentListItem from '../../components/CommentListItem';
import { useEffect } from 'react';
import TravodoLogo from '../../../assets/Logo/TravodoLogo.svg';
import OptionButton from '../../components/OptionButton';
import HeaderScrap from '../../components/HeaderScrap';
import PropTypes from 'prop-types';
import CommentInput from '../../components/CommentInput';

function CommunityContent({
  navigation,
  nickname,
  agoDate,
  title,
  content,
  circleColor,
  date,
  location,
  people,
  todo,
  hCount,
  cCount,
  onChangeText,
  send,
}) {
  useEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerLeft: () => <TravodoLogo width={100} height={20} marginLeft={32} />,
      headerTitle: '',
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <HeaderScrap
            style={{ marginRight: 15 }}
            size={16}
            onPress={() => console.log('스크랩')}
          />
          <OptionButton size={16} onPress={() => console.log('환경설정')} />
        </View>
      ),
    });
  });

  const data = [
    {
      id: 'c1',
      nickname: '여행조아',
      date: '3일 전',
      comment:
        '정말 유용한 정보 감사합니다! mbti P라서 계획이 늘 어려웠는데 큰 도움이 됐어요. 바로 저장했습니다!',
    },
    {
      id: 'c2',
      nickname: '가평마스터',
      date: '2일 전',
      comment:
        '익스트림 좋아하시면 잣향기 푸른숲 트레킹도 강추해요! 산림욕 하고 나면 정말 상쾌합니다. 코스에 넣어보세요.',
    },
    {
      id: 'c3',
      nickname: '떠나자NOW',
      date: '1일 전',
      comment:
        '와, 2박 3일 동안 이렇게 알차게 보내시다니 대단해요. 사진만 봐도 너무 재밌어 보여요. 다음 여행 계획도 기대하겠습니다!',
    },
    {
      id: 'c4',
      nickname: '계획형J',
      date: '15시간 전',
      commentlike: '4',
      comment:
        'P이신데도 이렇게 완벽한 계획을 짜시다니 놀랍네요! Travodo가 큰 역할을 한 것 같습니다 :)',
    },
  ];

  return (
    <View>
      <ScrollView contentContainerStyle={styles.scroll} bounces={false} overScrollMode="never">
        <View style={styles.container}>
          <View style={styles.profileContainer}>
            <ProfileImage size={25} />
            <Text style={styles.nickname}>{nickname}</Text>
            <Text style={styles.date}>{agoDate}</Text>
            <View style={styles.button}>
              <DotButton />
            </View>
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.content}>{content}</Text>
          </View>
          <View style={styles.tripplan}>
            <CommunityTripPlan
              circleColor={circleColor}
              title={title}
              date={date}
              location={location}
              people={people}
              todo={todo}
            />
          </View>
          <View style={styles.imageContainer}>
            <ImageGrid imageName={'image1'} />
            <ImageGrid imageName={'image2'} />
          </View>
          <View style={styles.heartncomment}>
            <Heart size={15} count={hCount} />
            <Comment size={15} count={cCount} />
          </View>
          <CommentListItem data={data} />
        </View>
      </ScrollView>
      <View style={styles.commentInput}>
        <CommentInput onChangeText={onChangeText} onPress={send} />
      </View>
    </View>
  );
}

CommunityContent.propTypes = {
  nickname: PropTypes.string.isRequired,
  agoDate: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  circleColor: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  people: PropTypes.number.isRequired,
  todo: PropTypes.object.isRequired,
  hCount: PropTypes.string.isRequired,
  cCount: PropTypes.string.isRequired,
  onChangeText: PropTypes.string,
  send: PropTypes.func,
};

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
  headerRightContainer: {
    alignItems: 'stretch',
    flexDirection: 'row',
    marginRight: 20,
  },
  commentInput: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  scroll: {
    paddingBottom: 90,
  },
});

export default CommunityContent;
