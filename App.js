import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ButtonGroup } from "react-native-elements";

// Question component
export const Question = ({ route, navigation }) => {
  const { data, index, answers } = route.params;
  const question = data[index];

  const [selected, setSelected] = useState(
    question.type === "multiple-answer" ? [] : null
  );

  const handlePress = (i) => {
    if (question.type === "multiple-answer") {
      setSelected((prev) =>
        prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
      );
    } else {
      setSelected(i);
    }
  };

  const handleNext = () => {
    if (selected === null || (Array.isArray(selected) && selected.length === 0))
      return;

    const updatedAnswers = [...answers, selected];

    if (index < data.length - 1) {
      navigation.push("Question", {
        data,
        index: index + 1,
        answers: updatedAnswers,
      });
    } else {
      navigation.navigate("Summary", {
        data,
        answers: updatedAnswers,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question.prompt}</Text>

      <ButtonGroup
        buttons={question.choices}
        vertical
        onPress={handlePress}
        selectedIndexes={
          question.type === "multiple-answer" ? selected : undefined
        }
        selectedIndex={
          question.type !== "multiple-answer" ? selected : undefined
        }
        containerStyle={styles.buttonGroup}
        selectedButtonStyle={{ backgroundColor: "#3f0013" }}
        testID="choices"
      />

      <TouchableOpacity
        style={[
          styles.nextButton,
          (selected === null ||
            (Array.isArray(selected) && selected.length === 0)) &&
            styles.disabledButton,
        ]}
        onPress={handleNext}
        disabled={
          selected === null ||
          (Array.isArray(selected) && selected.length === 0)
        }
      >
        <Text style={styles.nextButtonText}>Next Question</Text>
      </TouchableOpacity>
    </View>
  );
};

// Summary component
export const Summary = ({ route }) => {
  const { data, answers } = route.params;

  let score = 0;

  return (
    <ScrollView style={styles.container}>
      {data.map((question, qIndex) => {
        const userAnswer = answers[qIndex];
        const correctAnswer = question.correct;

        const isCorrect = Array.isArray(correctAnswer)
          ? Array.isArray(userAnswer) &&
            correctAnswer.length === userAnswer.length &&
            correctAnswer.every((val) => userAnswer.includes(val))
          : userAnswer === correctAnswer;

        if (isCorrect) score++;

        return (
          <View key={qIndex} style={styles.questionContainer}>
            <Text style={styles.questionText}>{question.prompt}</Text>
            {question.choices.map((choice, index) => {
              const isUserSelected = Array.isArray(userAnswer)
                ? userAnswer.includes(index)
                : userAnswer === index;

              const isCorrectChoice = Array.isArray(correctAnswer)
                ? correctAnswer.includes(index)
                : correctAnswer === index;

              return (
                <Text
                  key={index}
                  style={[
                    styles.choiceText,
                    isCorrectChoice && {
                      fontWeight: "bold",
                      color: "#3f0013",
                      textDecorationLine: "underline",
                    },
                    isUserSelected &&
                      !isCorrectChoice && {
                        textDecorationLine: "line-through",
                      },
                  ]}
                >
                  {choice}
                </Text>
              );
            })}
          </View>
        );
      })}

      <Text style={styles.scoreText} testID="total">
        Total Score: {score} / {data.length}
      </Text>
    </ScrollView>
  );
};

// The questions
export default function App() {
  const Stack = createStackNavigator();

  const data = [
    {
      prompt: "What is the average lifespan of an indoor cat?",
      type: "multiple-choice",
      choices: ["3–5 years", "6–8 years", "10–15 years", "18–22 years"],
      correct: 2,
    },
    {
      prompt: "Which of the following are signs that a cat is feeling relaxed?",
      type: "multiple-answer",
      choices: ["Slow blinking", "Flat ears", "Purring", "Hissing"],
      correct: [0, 2],
    },
    {
      prompt: "Do cats usually land on their feet when they fall?",
      type: "true-false",
      choices: ["Yes", "No"],
      correct: 0,
    },
  ];

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerBackVisible: false,
          headerLeft: null,
        }}
      >
        <Stack.Screen
          name="Question"
          component={Question}
          initialParams={{ data, index: 0, answers: [] }}
          options={{
            headerTitle: () => <Text style={styles.headerTitle}>Question</Text>,
          }}
        />
        <Stack.Screen name="Summary" component={Summary} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#edede9",
  },
  questionText: {
    fontSize: 18,
    marginBottom: 15,
  },
  buttonGroup: {
    marginBottom: 20,
  },
  questionContainer: {
    marginBottom: 25,
  },
  choiceText: {
    fontSize: 16,
    marginVertical: 3,
    color: "#000",
  },
  scoreText: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 30,
    textAlign: "center",
  },
  nextButton: {
    backgroundColor: "#3f0013",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 30,
    color: "#3f0013",
    textAlign: "center",
  },
});
