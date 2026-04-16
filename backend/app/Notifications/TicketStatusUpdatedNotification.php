<?php

namespace App\Notifications;

use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class TicketStatusUpdatedNotification extends Notification
{
    use Queueable;

    public function __construct(
        private readonly Ticket $ticket,
        private readonly string $oldStatus,
        private readonly string $newStatus,
        private readonly ?string $adminName = null,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'ticket_id' => $this->ticket->id,
            'ticket_title' => $this->ticket->title,
            'old_status' => $this->oldStatus,
            'new_status' => $this->newStatus,
            'message' => sprintf(
                'Your ticket "%s" changed from %s to %s%s.',
                $this->ticket->title,
                $this->formatStatus($this->oldStatus),
                $this->formatStatus($this->newStatus),
                $this->adminName ? ' by ' . $this->adminName : ''
            ),
        ];
    }

    private function formatStatus(string $status): string
    {
        return match ($status) {
            'needs-attention' => 'Needs Attention',
            'in-progress' => 'In Progress',
            'resolved' => 'Resolved',
            default => $status,
        };
    }
}
