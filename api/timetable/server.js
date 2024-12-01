const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const BASE_URL = "https://tvoje skola.bakalari.cz/api";

const USERNAME = "";
const PASSWORD = "";

async function getToken() {
  const API_BODY = `client_id=ANDR&grant_type=password&username=${encodeURIComponent(USERNAME)}&password=${encodeURIComponent(PASSWORD)}`;
  try {
    const { data } = await axios.post(`${BASE_URL}/login`, API_BODY, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    if (!data.access_token) throw new Error('Token nebyl získán.');
    return data.access_token;
  } catch (error) {
    console.error('Chyba při získávání tokenu:', error.message);
    throw error;
  }
}
async function fetchTimetable(token, type = 'permanent') {
  const endpoint = type === 'actual' ? 'actual' : 'permanent';
  try {
    const { data } = await axios.get(`${BASE_URL}/3/timetable/${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error(`Chyba při načítání ${type} rozvrhu:`, error.message);
    throw error;
  }
}

app.get('/api/timetable/permanent', async (req, res) => {
  try {
    const token = await getToken();
    const timetable = await fetchTimetable(token, 'permanent');
    const transformedTimetable = transformTimetable(timetable);
    res.json(transformedTimetable);
  } catch (error) {
    res.status(500).json({ error: 'Chyba při získávání permanentního rozvrhu' });
  }
});

app.get('/api/timetable/actual', async (req, res) => {
  try {
    const token = await getToken();
    const timetable = await fetchTimetable(token, 'actual');
    const transformedTimetable = transformTimetable(timetable);
    res.json(transformedTimetable);
  } catch (error) {
    res.status(500).json({ error: 'Chyba při získávání aktuálního rozvrhu' });
  }
});
function transformTimetable(data) {
  return data.Days.map((day) => ({
    dayOfWeek: `Den ${day.DayOfWeek}`,
    lessons: day.Atoms.map((lesson) => ({
      time: `${data.Hours.find((h) => h.Id === lesson.HourId)?.BeginTime || 'N/A'} - ${
        data.Hours.find((h) => h.Id === lesson.HourId)?.EndTime || 'N/A'
      }`,
      subject: data.Subjects.find((s) => s.Id.trim() === lesson.SubjectId?.trim())?.Name || 'N/A',
      teacher: data.Teachers.find((t) => t.Id.trim() === lesson.TeacherId?.trim())?.Name || 'N/A',
      room: data.Rooms.find((r) => r.Id.trim() === lesson.RoomId?.trim())?.Abbrev || 'N/A',
      theme: lesson.Theme || "",
      change: lesson.Change || null,
    })),
  }));
}
app.listen(port, () => {
  console.log(`Server běží na http://localhost:${port}`);
});
