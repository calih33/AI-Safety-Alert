<?php

namespace App\Mcp\Servers;

use Laravel\Mcp\Server;
use Laravel\Mcp\Server\Attributes\Instructions;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Version;
use App\Mcp\Tools\AddTicketTool;

#[Name('MCP Server')]
#[Version('0.0.1')]
#[Instructions('This server is used to manage tickets and staff. Tools are used to add tickets and ticket history')]
class MCPServer extends Server
{
    protected array $tools = [
        AddTicketTool::class
    ];

    protected array $resources = [
    ];

    protected array $prompts = [
    ];
}
