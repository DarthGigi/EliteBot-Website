import { FetchDiscordUserData } from '$lib/api/auth';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, url, cookies, parent }) => {
	await parent();

	locals.access_token ??= cookies.get('access_token');
	locals.refresh_token ??= cookies.get('refresh_token');

	if (!locals.access_token) {
		throw redirect(307, '/login?redirect=' + url.pathname);
	}

	if (!locals.user && locals.access_token) {
		const discord = await FetchDiscordUserData(locals.access_token);

		locals.user = discord ?? undefined;
	}

	if (!locals.user || !locals.access_token) {
		throw redirect(307, '/login?redirect=' + url.pathname);
	}

	return {
		user: locals.user,
	};
}) satisfies LayoutServerLoad;
