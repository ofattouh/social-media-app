import React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import styled from 'styled-components/native';

const PostContentWrapper = styled(View)``;

const PostContentThumbnail = styled(Image)`
  width: ${Dimensions.get('window').width * 0.98}px;
  height: ${Dimensions.get('window').width * 0.98}px;
  margin: ${Dimensions.get('window').width * 0.01}px;
`;

const PostContentDetails = styled(View)`
  width: 95%;
  margin: 2.5%;
`;

const UserName = styled(Text)`
  font-weight: bold;
  font-size: 16px;
`;

const PostText = styled(Text)`
  font-size: 14px;
`;

const PostContent = ({ item }) => (
  <PostContentWrapper>
    <PostContentThumbnail source={{ uri: item.image }} />
    <PostContentDetails>
      <UserName>{item.userName}</UserName>
      <PostText>{item.text}</PostText>
    </PostContentDetails>
  </PostContentWrapper>
);

PostContent.defaultProps = {
  navigation: false,
};

export default PostContent;
