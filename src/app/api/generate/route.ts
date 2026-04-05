import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: process.env.GROQ_API_BASE,
});

const SYSTEM_PROMPT = `You are HoopTrainer AI, a professional basketball strength and conditioning coach.
Your job: create basketball-specific programs that mix ON-COURT skill drills with ATHLETIC DEVELOPMENT (plyometrics, sprints, strength).
Audience: aspiring or professional players.

Must include:
- On-court drills with ball: ball-handling, footwork, change-of-direction, closeouts, finishing, shooting reps (specify makes or attempts).
- Athletic/physical work: sprints, plyos, agility, strength/power lifts or bodyweight, conditioning.
- For each day: list exercises with sets, reps (or makes/time/distance), rest.

Rules:
1) ONLY basketball-specific training; never generic bodybuilding splits.
2) Always structure by Day 1, Day 2, Day 3 (or number of days requested).
3) Mix skill + athletic in the same day (skill block first, then physical block).
4) Keep it realistic for the level and schedule; manage volume and rest.
5) Keep explanations short; look like a real coach’s practice plan.
6) If goal is vertical jump: include jumps/plyos + approach jumps + strength for posterior chain.
7) If goal is speed/first step: include starts, lateral-to-sprint, resisted or overspeed where appropriate.
8) If user asks for position (guard/wing/big), adapt drills accordingly (guard = more handle/PnR; big = seals, drop-steps, short-roll).`;

const EXAMPLE_ASSISTANT = `Example format (2 days):
DAY 1 (Skill + Athletic)
- Ball-Handling: 3 x 40s In-n-Out + Cross (both hands), rest 40s
- Finishing: 40 makes total (10/side: euro, inside-hand, reverse, power)
- Shooting: 120 makes (5 spots x 8 makes x 3 rounds)
- Plyo: Approach Jumps 4x3; Lateral Bounds 3x6/side
- Strength: Trap Bar Deadlift 4x5; Split Squat 3x8/leg; Nordic ecc 3x4
- Conditioning: Court Shuttles 6x down-and-back @75% (30s rest)

DAY 2 (Skill + Athletic)
- Footwork: Jab → 1-dribble pull-up both sides 5x5 makes/spot (50 makes)
- Ball-Handling: Retreat-dribble to punch out 3x6/side (20–25s work, 35s rest)
- Shooting: PnR pull-up + snake to floater, 60 makes
- Speed: 10m sprint starts 6 reps; Slide-to-sprint 5 reps; Pro-Agility 5 reps
- Strength/Power: Hang Power Clean 4x3; Bulgarian Split Squat 3x8/leg; Calf raise 3x12
- Conditioning: 10 x 30/30 court runs`;

type ChatRole = "user" | "assistant" | "system";
interface ChatMessage {
  role: ChatRole;
  content: string;
}

function isChatMessage(m: unknown): m is ChatMessage {
  return (
    typeof m === "object" &&
    m !== null &&
    "role" in m &&
    "content" in m &&
    typeof (m as { content?: unknown }).content === "string" &&
    ["user", "assistant", "system"].includes(
      (m as { role?: unknown }).role as string
    )
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    let messagesArr: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "assistant", content: EXAMPLE_ASSISTANT },
    ];

    // If frontend sends message history
    if (Array.isArray(body.messages) && body.messages.length > 0) {
      const rawMessages: unknown[] = body.messages;
      messagesArr = [
        { role: "system", content: SYSTEM_PROMPT },
        ...rawMessages
          .filter(isChatMessage)
          .map((m) => ({
            role: m.role,
            content: m.content,
          })),
      ];
    } else {
      // Single prompt fallback
      const prompt = String(body?.prompt ?? "").trim();
      if (!prompt) {
        return NextResponse.json(
          {
            error:
              "Please write your request (e.g., '10-day plan for a guard, goal explosiveness').",
          },
          { status: 400 }
        );
      }
      // NO length restriction! (If you want, add here.)
      messagesArr.push({ role: "user", content: prompt });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Server missing GROQ_API_KEY env variable." },
        { status: 500 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      messages: messagesArr,
    });

    const text = completion.choices[0]?.message?.content?.trim();
    if (!text) {
      return NextResponse.json(
        { error: "No response returned from AI. Please try again." },
        { status: 502 }
      );
    }

    const html = text.replace(/\n/g, "<br/>");
    return NextResponse.json({ text, html });
  } catch (error) {
    console.error("AI request failed:", error);
    return NextResponse.json(
      { error: "AI request failed. Please try again." },
      { status: 500 }
    );
  }
}