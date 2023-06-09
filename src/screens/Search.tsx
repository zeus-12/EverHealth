import React, { useState } from "react";
import {
	Keyboard,
	ScrollView,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { Image } from "expo-image";
import Layout from "@components/common/Layout";
import { TextArea } from "native-base";
import { useUserStore } from "../hooks/useStore";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { chatbotId, userId } from "../../secrets";
import { ReminderType } from "@/types/storage";
import { SCREEN_WIDTH, blurHash } from "@/lib/constants";

const dog0 = require("../assets/gifs/0.gif");
const dog1 = require("../assets/gifs/1.gif");
const dog2 = require("../assets/gifs/2.gif");
const dog3 = require("../assets/gifs/3.gif");
const dog4 = require("../assets/gifs/4.gif");
const dog5 = require("../assets/gifs/5.gif");

const Search = ({ navigation }) => {
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [results, setResults] = useState([]);

	const { age, gender, height, weight } = useUserStore((s) => s);

	const queryHandler = async () => {
		Keyboard.dismiss();
		if (!query.trim()) return;

		setLoading(true);
		const url = "https://ora.sh/api/conversation";

		const payload = {
			chatbotId: chatbotId,
			input:
				query +
				` for a ${gender}, of age ${age}, ${height}cm tall weighing ${weight}kg `,
			userId: userId,
			includeHistory: false,
			model: "gpt-4",
			provider: "OPEN_AI",
		};

		console.log(payload.input);
		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Referer: "https://ora.sh/openai/gpt4",
					Origin: "https://ora.sh",
					"User-Agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
				},
				body: JSON.stringify(payload),
			});

			const data = await response.json();
			console.log(data);

			let resp = data.response;
			// resp = JSON.parse(resp);
			console.log("resp", resp);
			resp = resp.split("- ").filter((item) => item);

			setResults(resp);
			setLoading(false);
			setError(false);
		} catch (err) {
			console.log("here");
			console.log(err.message);
			setLoading(false);
			setError(true);
		}
	};

	const addReminder = (task: string) => {
		navigation.navigate("Add Reminder", {
			task,
			reminderType: ReminderType.PERSONAL_GROWTH,
		});
	};

	return (
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<Layout pageHeading="Search">
				<View className="flex-row items-center gap-4">
					<View className="flex-1">
						<TextArea
							// @ts-ignore
							className="rounded-md bg-gray-200 dark:text-slate-200 dark:bg-slate-700"
							placeholder="Email"
							h={"16"}
							value={query}
							onChangeText={(text) => setQuery(text)}
						/>
					</View>
					<TouchableOpacity onPress={queryHandler}>
						<AntDesign
							name="search1"
							size={24}
							className="text-black dark:text-slate-200"
						/>
					</TouchableOpacity>
				</View>

				<ScrollView showsVerticalScrollIndicator={false} className="mt-2 mb-16">
					<SearchBody
						error={error}
						loading={loading}
						results={results}
						addReminder={addReminder}
					/>
				</ScrollView>
			</Layout>
		</TouchableWithoutFeedback>
	);
};

const SearchBody = ({ error, loading, results, addReminder }) => {
	if (error) {
		return (
			<Text className="text-lg font-medium text-gray-900 dark:text-slate-100">
				Error
			</Text>
		);
	} else if (loading) {
		const gifs = [dog0, dog1, dog2, dog3, dog4, dog5];
		const random = Math.floor(Math.random() * gifs.length);

		return (
			<>
				<Image
					// source={require(`../assets/dog.gif`)}
					source={gifs[random]}
					contentFit="cover"
					transition={1000}
					placeholder={blurHash}
					className="mx-auto rounded-lg"
					style={{ width: SCREEN_WIDTH - 30, height: SCREEN_WIDTH - 30 }}
				/>
				<Text className="text-center text-lg font-medium text-gray-900 dark:text-slate-100">
					Enjoy the GIF while you wait :)
				</Text>
			</>
		);
	} else if (results?.length > 0) {
		return (
			<View className="my-2">
				{results.map((item, index) => (
					<View
						key={index}
						className="flex-row my-2 w-full items-center border-[0.2px] border-gray-400 dark:border-gray-500 rounded-xl"
					>
						<Text
							className={`break-words mr-2 p-2 text-lg font-medium text-black dark:text-slate-200`}
							style={{ width: "85%" }}
						>
							{item}
						</Text>

						<TouchableOpacity
							className=" h-full flex-row items-center justify-center bg-blue-100 dark:bg-blue-400 rounded-r-xl rounded-e-xl"
							style={{ width: "12.75%" }}
							onPress={() => addReminder(item)}
						>
							<MaterialIcons
								name="add-task"
								size={24}
								className="text-black dark:text-slate-200"
							/>
						</TouchableOpacity>
					</View>
				))}
			</View>
		);
	} else {
		return (
			<Text className="text-lg font-medium text-gray-900 dark:text-slate-100">
				Please enter you query
			</Text>
		);
	}
};

export default Search;
