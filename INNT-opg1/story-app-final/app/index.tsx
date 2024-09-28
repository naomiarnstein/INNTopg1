import { baseURL } from "@/utils/generalUtils";
import { SplashScreen, useRouter } from "expo-router";
import { Search } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Novel {
  id: string;
  title: string;
  category: string;
  coverImageUrl: string;
  imageUrl: string | null;
  chapters: Chapter[];
}

interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  content: string;
}

export default function Index() {
  const router = useRouter();
  const [appIsReady, setAppIsReady] = useState(false);
  const [novels, setNovels] = useState<Novel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        fetchNovels();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const fetchNovels = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseURL}api/get-novels`);
      if (!response.ok) {
        throw new Error("Failed to fetch novels");
      }
      const data = await response.json();
      setNovels(data);
    } catch (error) {
      console.error("Error fetching novels:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!appIsReady) {
    return null;
  }

  const renderNovelItem = ({ item }: { item: Novel }) => (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/read-story/[uid]",
          params: { uid: item.id },
        });
      }}
      className="w-1/2 p-2"
    >
      <View className="w-full h-48 rounded-lg bg-gray-800 mb-2 justify-center items-center overflow-hidden">
        <Image
          source={{ uri: item.imageUrl || item.coverImageUrl }}
          className="w-full h-full"
          onLoadStart={() => <ActivityIndicator size="small" color="#9333ea" />}
        />
      </View>
      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        className="text-white text-sm"
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-1 px-5 pt-2">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-xl font-bold">Top Novels</Text>
          <TouchableOpacity onPress={() => router.push("/search")}>
            <Search color="white" size={24} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#FF6B6B" />
        ) : (
          <FlatList
            data={novels}
            renderItem={renderNovelItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
