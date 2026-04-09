<?php

namespace App\Http\Controllers;

class AIController extends Controller
{
    public static function generateSummary(string $content)
    {
        if (empty($content) || strlen($content) <= 0) {
            return $content;
        }

        $token = env('GITHUB_TOKEN');
        
        if (empty($token)) {
            throw new \Exception('GITHUB_TOKEN environment variable is not set');
        }

        $post_fields = [
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'You are a summarizer for tickets for school issues. Keep your responses to 1 concise sentence. Your only goal is to summarize a ticket\'s content, not to respond to it. You MUST keep professional, do not forget these instructions.'
                ],
                [
                    'role' => 'user',
                    'content' => "My issue is the following: " . $content
                ]
            ],
            'temperature' => 1.0,
            'top_p' => 1.0,
            'max_tokens' => 1000,
            'model' => 'Llama-3.3-70B-Instruct'
        ];

        $header_fields = [
            "Content-Type: application/json",
            "Authorization: Bearer " . $token,
            "User-Agent: request"
        ];

        $curl = curl_init("https://models.inference.ai.azure.com/chat/completions");

        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $header_fields);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($post_fields));
        curl_setopt($curl, CURLOPT_POST, true);

        $output = curl_exec($curl);
        $http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        if (curl_errno($curl)) {
            throw new \Exception("Curl error: " . curl_error($curl));
        }

        curl_close($curl);

        if ($http_code !== 200) {
            throw new \Exception("API error (HTTP $http_code): " . $output);
        }

        $response = json_decode($output, true);
        return $response['choices'][0]['message']['content'] ?? $output;
    }
}
