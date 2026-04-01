interface DividerProps {
    text?: string;
}

export function Divider({ text }: DividerProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border-subtle" />
            {text && (
                <span className="text-xs font-medium text-text-muted whitespace-nowrap">
                    {text}
                </span>
            )}
            <div className="h-px flex-1 bg-border-subtle" />
        </div>
    );
}
