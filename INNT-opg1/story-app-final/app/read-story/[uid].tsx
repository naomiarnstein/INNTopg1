import { baseURL } from "@/utils/generalUtils";
import { useLocalSearchParams } from "expo-router";
import { ALargeSmall } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const fontSizes = ["Small", "Medium", "Large"];

type Chapter = {
  id: string;
  chapterNumber: number;
  title: string;
  content: string;
};

type Novel = {
  id: string;
  title: string;
  category: string;
  coverImageUrl: string;
  code: number;
  chapters: Chapter[];
};

export default function ReadStory() {
  const { uid } = useLocalSearchParams();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [selectedFontSize, setSelectedFontSize] = useState("Large");

  useEffect(() => {
    fetchNovel();
  }, []);

  const fetchNovel = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseURL}api/get-novel/${uid}`);
      if (!response.ok) {
        throw new Error("Failed to fetch novel");
      }
      const data = await response.json();
      setNovel(data.novel);
    } catch (error) {
      console.error("Error fetching novel:", error);
      Alert.alert("Error", "Failed to fetch novel. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getHeaderText = () => {
    if (!novel || !novel.title) {
      return "Novel";
    } else {
      return novel.title.length > 30
        ? novel.title.substring(0, 30) + "..."
        : novel.title;
    }
  };

  const getFontSize = () => {
    switch (selectedFontSize) {
      case "Small":
        return 14;
      case "Large":
        return 18;
      default:
        return 16;
    }
  };

  const extractChapters = (content: string) => {
    const chapterRegex = /^(Chapter\s+\d+:?\s*)/gim;
    const chapters = content.split(chapterRegex).filter(Boolean);
    const result = [];

    for (let i = 0; i < chapters.length; i += 2) {
      result.push({
        header: chapters[i].trim(),
        content: chapters[i + 1]?.trim() || "",
      });
    }

    return result;
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900 justify-center items-center">
        <ActivityIndicator size="large" color="#9333ea" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="pl-5 py-3 bg-gray-900 z-10 flex-row justify-between items-center">
        <Text className="text-xl font-bold text-white">{getHeaderText()}</Text>
        <TouchableOpacity
          onPress={() => setShowFontMenu(!showFontMenu)}
          className="pr-5"
        >
          <ALargeSmall size={24} color="#9333ea" />
        </TouchableOpacity>
      </View>
      {showFontMenu && (
        <View className="absolute top-[110px] left-0 right-0 bg-gray-800 z-20 p-3 mx-5">
          <Text className="text-white text-center py-2 font-bold">
            Choose Font Size
          </Text>
          {fontSizes.map((size, index) => (
            <TouchableOpacity
              key={size}
              onPress={() => {
                setSelectedFontSize(size);
                setShowFontMenu(false);
              }}
              className={`p-4 ${index !== fontSizes.length - 1 && "border-b border-gray-700"
                }`}
            >
              <Text className="text-white">
                {size} (
                {size === "Small" ? "14" : size === "Medium" ? "16" : "18"})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <ScrollView className="flex-1 px-5">
        {novel && novel.chapters && novel.chapters.length > 0 && (
          <View className="mb-5">
            {extractChapters(novel.chapters[0].content).map(
              (chapter, index) => (
                <View key={index} className="mb-6">
                  <Text
                    className="text-white font-bold mb-2"
                    style={{
                      fontSize: getFontSize() + 2,
                    }}
                  >
                    {chapter.header}
                  </Text>
                  <Text
                    className="text-white mb-4"
                    style={{
                      fontSize: getFontSize(),
                    }}
                  >
                    {chapter.content}
                  </Text>
                </View>
              )
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
