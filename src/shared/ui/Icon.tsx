const paths: Record<string, string[]> = {
    sparkles: [
      'M9 4l1.7 5.3L16 11l-5.3 1.7L9 18l-1.7-5.3L2 11l5.3-1.7L9 4Z',
      'M19 2v6M16 5h6M19 16v6M16 19h6',
    ],
    heart: [
      'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
    ],
    bow: [
      'M12 10C9 2 2 2 2 7c0 5 7 6 10 3Z',
      'M12 10c3-8 10-8 10-3 0 5-7 6-10 3Z',
      'M12 10c-1 4-3 7-5 10',
      'M12 10c1 4 3 7 5 10',
      'M10.5 10c0-2 3-2 3 0s-3 2-3 0Z',
    ],
    plus: ['M12 5v14', 'M5 12h14'],
    minus: ['M5 12h14'],
    close: ['m6 6 12 12', 'M18 6 6 18'],
    search: ['M21 21l-5-5', 'M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0'],
    Bags: ['M5 7h14l1 14H4L5 7Z', 'M8 8V6a4 4 0 0 1 8 0v2'],
    Shoes: [
      'M3 13V8l5 3 3-2 3 5 6 2a2 2 0 0 1 1 2v2H3v-7Z',
      'M3 17h18',
      'M10 11l2-1',
      'M12 13l2-1',
    ],
    Accessories: [
      'M9 7V2h6v5',
      'M9 17v5h6v-5',
      'M12 8v4l2 1',
      'M18 12a6 6 0 1 1-12 0 6 6 0 0 1 12 0',
    ],
  }
export function Icon({ name, size }: { name: string; size?: number }) {
 return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" width={size} height={size}>
 {(paths[name] ?? paths.Bags).map(d => <path key={d} d={d} />)}
 </svg>
}
