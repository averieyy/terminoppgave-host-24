
/**
 * Send a message on a specific controller.
 * @param controller The controller that will send the message
 * @param message Content of the message, should be string
 * @returns Whether the message could be sent.
 */
export function sendMessage(controller: ReadableStreamDefaultController<string>, message: string) : boolean {
  try {
    controller.enqueue(`data: ${message}\n\n`);
    return true;
  }
  catch {
    return false;
  }
}