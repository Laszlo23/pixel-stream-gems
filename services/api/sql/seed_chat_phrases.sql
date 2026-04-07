-- Idempotent seed: only inserts when chat_phrases is empty.
INSERT INTO chat_phrases (room_id, category, text, weight)
SELECT * FROM (VALUES
  (NULL::TEXT, 'greeting', 'Hey — welcome in! Glad you made it.', 2),
  (NULL::TEXT, 'greeting', 'Hi everyone, good energy in here tonight.', 2),
  (NULL::TEXT, 'greeting', 'Welcome! Drop a wave if you are new.', 1),
  (NULL::TEXT, 'filler', 'We are keeping things chill and on-topic.', 2),
  (NULL::TEXT, 'filler', 'Love the vibes — thanks for hanging out.', 2),
  (NULL::TEXT, 'filler', 'Grab a seat, trivia might pop up soon.', 1),
  (NULL::TEXT, 'hype', 'Let us gooo — stack those reactions.', 2),
  (NULL::TEXT, 'hype', 'That tip streak is unreal, thank you.', 1),
  (NULL::TEXT, 'question', 'What should we queue next — music, games, or Q&A?', 2),
  (NULL::TEXT, 'question', 'Anyone here for the first time tonight?', 2),
  (NULL::TEXT, 'question', 'What city are you tuning in from?', 1)
) AS v(room_id, category, text, weight)
WHERE NOT EXISTS (SELECT 1 FROM chat_phrases LIMIT 1);
