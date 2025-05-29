export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured.' });
  }

  const { event, eventDate, ability, sex, age, height, weight, goal, experience, days, notes, userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  const prompt = `Generate a detailed, personalized workout plan for the following user:\nEvent: ${event}\nEvent Date: ${eventDate}\nAbility: ${ability}\nSex: ${sex}\nAge: ${age}\nHeight: ${height} cm\nWeight: ${weight} kg\nGoal: ${goal}\nExperience: ${experience}\nDays per week: ${days}\nNotes: ${notes}\n\nThe plan should include:\n- Weekly breakdowns\n- Specific exercises (with sets, reps, rest)\n- Warm-up and cool-down advice\n- Nutrition or recovery tips\n- Motivation for the user\n\nFormat the response in Markdown.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1200,
        temperature: 0.7
      })
    });
    const data = await response.json();
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }
    const plan = data.choices[0].message.content;
    // Save to Firestore (server-side)
    try {
      const admin = require('firebase-admin');
      if (!admin.apps.length) {
        admin.initializeApp();
      }
      const db = admin.firestore();
      const docRef = await db.collection('users').doc(userId).collection('workoutPlans').add({
        event,
        eventDate,
        ability,
        sex,
        age,
        height,
        weight,
        goal,
        experience,
        days,
        notes,
        plan,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      res.status(200).json({ plan, planId: docRef.id });
    } catch (firestoreError) {
      res.status(500).json({ error: 'Plan generated but failed to save: ' + firestoreError.message, plan });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
