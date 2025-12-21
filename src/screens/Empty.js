import { View, Pressable, Text, Modal, StyleSheet } from 'react-native';
import { useState } from 'react';
import Scrap from '../../assets/ComponentsImage/Scrap.svg';
import Close from '../../assets/ComponentsImage/Close.svg';
import Report from '../../assets/ComponentsImage/Report.svg';
import { colors } from '../styles/colors';

function Empty() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setModalVisible(true)}>
        <Text>모달열기</Text>
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalbox}>
            <View style={styles.closeStyle}>
              <Pressable onPress={() => setModalVisible(false)}>
                <Close width={15} height={15} />
              </Pressable>
            </View>
            <Pressable style={styles.scrapContainer}>
              <Scrap width={24} height={23} />
              <Text style={styles.scrapText}>글 저장하기</Text>
            </Pressable>
            <Pressable style={styles.scrapContainer}>
              <Report width={24} height={23} />
              <Text style={styles.report}>신고하기</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingVertical: 20.5,
    alignItems: 'flex-end',
    paddingRight: 20,
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
});

export default Empty;
