// components/AvatarPicker.js

import React from "react";
import { View, Pressable, Image, StyleSheet } from "react-native";
import { AVATARS, AVATAR_KEYS } from "../assets/avatars/avatarConfig";

export default function AvatarPicker({ value, onChange }) {
  return (
    <View style={styles.grid}>
      {AVATAR_KEYS.map((key) => {
        const source = AVATARS[key];
        const isSelected = value === key;

        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            style={[
              styles.avatarWrapper,
              isSelected && styles.avatarWrapperSelected,
            ]}
          >
            <Image source={source} style={styles.avatarImage} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  avatarWrapperSelected: {
    borderColor: "#ff7ab5", 
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
