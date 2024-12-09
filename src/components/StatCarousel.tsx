import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface StatCarouselProps {
  data: React.ReactNode[];
}

let { width: viewportWidth } = Dimensions.get('window');
export default function StatCarousel({ data }: StatCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / viewportWidth);
    setCurrentIndex(index);
  };

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToOffset({
      offset: index * viewportWidth,
      animated: true,
    });
    setCurrentIndex(index);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    } else {
      scrollToIndex(data.length - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      scrollToIndex(currentIndex + 1);
    } else {
      scrollToIndex(0);
    }
  };

  const renderItem = ({ item }: { item: React.ReactNode }) => (
    <View style={styles.itemContainer}>{item}</View>
  );

  return (
    <View>
      <View style={styles.carouselRow}>
        <TouchableOpacity onPress={handlePrev} style={[styles.navButton]}>
          <Text style={styles.navButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <FlatList
          ref={flatListRef}
          data={data}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToAlignment="center"
          snapToInterval={styles.itemContainer.width}
        />

        <TouchableOpacity onPress={handleNext} style={[styles.navButton]}>
          <Text style={styles.navButtonText}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    width: viewportWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  carouselRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  navButton: {
    padding: 10,
    backgroundColor: '#4AB7BD',
    borderRadius: 5,
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
