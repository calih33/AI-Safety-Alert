<?php

namespace App\Http\Controllers;

use App\Models\Department;

class AIController extends Controller
{
    private static function sendRequest(array $messages): array
    {
        $token = env('GITHUB_TOKEN');

        if (empty($token)) {
            throw new \Exception('GITHUB_TOKEN environment variable is not set');
        }

        $payload = [
            'messages' => $messages,
            'temperature' => 1.0,
            'top_p' => 1.0,
            'max_tokens' => 1000,
            'model' => 'Llama-3.3-70B-Instruct',
        ];

        $headers = [
            "Content-Type: application/json",
            "Authorization: Bearer $token",
            "User-Agent: request",
        ];

        $curl = curl_init('https://models.inference.ai.azure.com/chat/completions');

        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($curl, CURLOPT_POST, true);

        $output = curl_exec($curl);
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        if (curl_errno($curl)) {
            throw new \Exception("Curl error: " . curl_error($curl));
        }

        curl_close($curl);

        if ($httpCode !== 200) {
            throw new \Exception("API error (HTTP $httpCode): " . $output);
        }

        return json_decode($output, true) ?? [];
    }

    public static function generateSummary(string $content)
    {
        if (trim($content) === '') {
            return $content;
        }

        $messages = [
            [
                'role' => 'system',
                'content' => 'Summarize this school support ticket in one professional sentence. Maximum fifteen words.'
            ],
            [
                'role' => 'user',
                'content' => "My issue is the following: " . $content
            ],
        ];

        $response = self::sendRequest($messages);

        return trim((string) ($response['choices'][0]['message']['content'] ?? $content));
    }

    public static function generatePriority(string $content)
    {
        if (trim($content) === '') {
            return $content;
        }

        $messages = [
            [
                'role' => 'system',
                'content' => 'Return only one number for ticket priority: 1, 2, or 3. Higher number means more urgent.'
            ],
            [
                'role' => 'user',
                'content' => "My issue is the following: " . $content
            ],
        ];

        $response = self::sendRequest($messages);

        $raw = trim((string) ($response['choices'][0]['message']['content'] ?? '1'));
        if (preg_match('/\d+/', $raw, $matches)) {
            return (int) $matches[0];
        }

        return 1;
    }

    public static function generateDepartmentID(string $content)
    {
        if (trim($content) === '') {
            return $content;
        }

        $departmentsText = "Available departments:";

        foreach (Department::all() as $department) {
            $name = $department->getAttribute('name');
            $id = $department->getKey();
            $departmentsText .= "\nName: $name, ID: $id";
        }

        $routingRules = 'Routing hints: computer, laptop, monitor, wifi, internet, login, software, printer -> IT Support. spill, leak, garbage, washroom cleaning, biohazard cleanup -> Custodial. broken door, broken furniture, HVAC, lighting, plumbing, water damage -> Facilities. injury, bleeding, illness, medical emergency -> Medical. violence, theft, threat, suspicious person, unsafe behavior -> Security.';

        $messages = [
            [
                'role' => 'system',
                'content' => 'Pick the best department ID for this ticket. Reply with numbers only. Use only the listed departments. If more than one could help, pick the first team that should respond. ' . $routingRules . ' ' . $departmentsText
            ],
            [
                'role' => 'user',
                'content' => "My issue is the following: " . $content
            ],
        ];

        $response = self::sendRequest($messages);

        $raw = trim((string) ($response['choices'][0]['message']['content'] ?? ''));
        if (preg_match('/\d+/', $raw, $matches)) {
            return (int) $matches[0];
        }

        return null;
    }
}
