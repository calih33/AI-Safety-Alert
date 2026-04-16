<?php

use App\Mcp\Servers\MCPServer;
use Laravel\Mcp\Facades\Mcp;

Mcp::web('/mcp/ticket', MCPServer::class);
Mcp::local('ticket', MCPServer::class);
